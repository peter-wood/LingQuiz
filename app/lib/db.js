var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('./config.js');
var db;

var connect = function() {
    mongoose.connect('mongodb://localhost/' + config.db);
    db = mongoose.connection;
    db.on('error', console.log.bind(console, 'connection error:'));
    db.once('open', console.log.bind(console, 'connection established'));
};

var mySchema = mongoose.Schema( {
    name: String,
    nsid: String,
    snum: Number,
    quizzes: Object,
    reserved: Object});

mySchema.methods.success = function() {
        console.log( 'saved record for ' + this.nsid);
};

var questionSchema = mongoose.Schema( {
	question: String,
    	resource: String,
    	opt1: String,
    	opt2: String,
    	opt3: String,
    	opt4: String,
    	opt5: String,
    	correct: Number,
    	id: Number});

var user = mongoose.model('User', mySchema);
var question = mongoose.model(config.currentQuestionSet, questionSchema);

var testingData = [
    {name: 'peter', nsid: 'pew191', snum: 1234, quizzes: null, reserved: null},
    {name: 'anita', nsid: 'aat123', snum: 5678, quizzes: {test: 5678}, reserved: {test: 'salt2'}},
    {name: 'john doe', nsid: 'sts456', snum: 9012, quizzes: null, reserved: null}];


// In testing only: Populate database with dummy entries.
var init = function () {
    if(config.deployment != 'testing')
	    return;
    deleteAll();
    for (index = 0; index < testingData.length; ++index) {
        console.log('creating: ' + JSON.stringify(testingData[index]));
        addUser( testingData[index].nsid, 
	    testingData[index].name,
            testingData[index].snum,
            testingData[index].quizzes,
            testingData[index].reserved);
    };
    printAll()
};

// clears entire collection. Dangerous
var deleteAll = function() {
    user.remove({}, function(err) {
        if (err) {
            console.error.log(err);
        }
        console.log('user store cleared');
    });
};

var printAll = function() {
    user.find()
        .select('nsid snum name')
        .exec(function(err, users) {
            if (err) return console.error(err);
            if (users.length === 0) {
                console.log('user store is empty.');
                return false;
            }
            for(i = 0; i < users.length; ++i) {
                console.log('%d, %s, %s, %s', i+1, users[i].name, users[i].nsid, users[i].snum);
            }
    });
};

var questionCache = [];

var getQuestions = function(cb) {
	question.find()
	.select('question resource opt1 opt2 opt3 opt4 opt5 correct id')
	.exec(function(err, questions) {
		if (err) return console.error(err);
		if (questions.length === 0) {
			console.error('no matching questions found');
			return false;
		}
		for (var i = 0; i < questions.length; ++i) {
            var temp = {};
			temp.question = questions[i].question;
			temp.resource = questions[i].resource;
			temp.opt1 = questions[i].opt1;
			temp.opt2 = questions[i].opt2;
			temp.opt3 = questions[i].opt3;
			temp.opt4 = questions[i].opt4;
			temp.opt5 = questions[i].opt5;
			temp.correct = questions[i].correct;
			temp.id = questions[i].id;
			questionCache.push(temp);
		}
	cb();
	});
}

var questioncb = null;

var getOneQuestion = function(cb) {
	questioncb = cb
	if (questionCache.length === 0) {
		getQuestions(retQuestion);
	} 
	else retQuestion();
}

var retQuestion = function() {
	var max = questionCache.length;
	var resultId = Math.floor(Math.random()*(max));
	var result =  questionCache[resultId];
	questionCache.splice(resultId, 1);
    console.log('returning max %d resultId %d', max, resultId);
    console.log('cache has %d questions', questionCache.length);
	questioncb(result);
}



var addUser = function(nsid, name, snum, quizzes, reserved) {
    var u = new user({name: name, nsid: nsid, snum: snum, quizzes: quizzes, reserved:reserved});
    u.save(function(err, u) {
        if (err) return console.error(err);
        u.success();
    });
};

// holds address for current callback function (not very ellegant)
var currentCallback = null;
var currentPass = null;

// helper function for haveUser()
var checkPass = function(err, u) {
    console.log('in checkPass. Error: %s, u: %s', err, u);
    var result = false;
    if (err === null && u != null ) {
        console.log('found snum: %s for nsid: %s',  u.snum, u.nsid);
        var myNum = crypto.createHash('md5')
            .update(String(u.snum), 'utf8')
            .digest('hex'); 
        console.log('my md5: %s', myNum);
        if (myNum === currentPass) {
            result = true;
            console.log('db found user');
        }
    }
    currentCallback (result);
}

var haveUser = function(nsid, pass, cb) {
    currentCallback = cb;
    currentPass = pass;
    console.log('haveUser called with nsid: %s, and pass: %s', nsid, pass);
    var query = user.findOne({'nsid': nsid});
    query.select('nsid snum');
    query.exec(checkPass);
}

            


var mongo = connect;
mongo.connect = connect;
mongo.init = init;
mongo.printAll = printAll;
mongo.deleteAll = deleteAll;
mongo.haveUser = haveUser;
mongo.getQuestion = getOneQuestion;

module.exports = mongo;



