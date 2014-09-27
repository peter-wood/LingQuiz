var crypto = require('crypto');
var quizdb = require('./v2quizdb');
var config = require('./config');
mongoose.set('debug', true);
//


var myQuestionSchema = mongoose.Schema( {
    myQuestion: {type: mongoose.Schema.Types.ObjectId, ref: 'question'},
    answer: {type: Number, default: 0},
    lastaccess: {type: Date, default: Date.now}});

myQuestionSchema.methods.print = function() {
    this.populate('myQuestion');
    //console.log('Question: ', this.myQuestion);
    console.log('Answer: ', this.answer);
    console.log('Last Access: ', this.lastaccess);
}

var myQuizSchema = mongoose.Schema( {
    name: String,
    questionSet: [myQuestionSchema],
} );

myQuizSchema.methods.print = function() {
    //this.populate('questionSet');
    console.log('Name: ', this.name);
    console.log('Questions: ');
    console.log(this.questionSet);
    console.log(this.questionSet[0]);
    for (var q = 0; q < this.questionSet.length; ++q) {
        console.log(this.questionSet[q]['answer']);
        console.log(this.questionSet[q]['lastaccess']);
        console.log(this.questionSet[q]['myQuestion']);
    }
}

var userSchema = mongoose.Schema( {
    name: String,
    nsid: String,
    snum: Number,
    quizzes: [myQuizSchema]
});

userSchema.methods.success = function() {
        console.log( 'saved record for ' + this.nsid);
};

userSchema.methods.print = function() {
        console.log('name: ', this.name);
        console.log('nsid: ', this.nsid)
        console.log('snum: ', this.snum);
        console.log('quizzes: ');
        for (var x = 0; x < this.quizzes.length; ++x) {
            this.quizzes[x].print();
        }
}

var user = mongoose.model('User', userSchema);

var testingData = [
    {name: 'peter', nsid: 'pew191', snum: 1234},
    {name: 'anita', nsid: 'aat123', snum: 5678},
    {name: 'john doe', nsid: 'sts456', snum: 9012}];


// In testing only: Populate database with dummy entries.
var init = function () {
    if(config.deployment != 'testing')
	    return;
    deleteAll(function() {
        for (index = 0; index < testingData.length; ++index) {
            console.log('creating: ' + JSON.stringify(testingData[index]));
            addUser( 
                testingData[index].nsid, 
                testingData[index].name,
                testingData[index].snum, function() {
                 console.log('print complete');
                });
        };
    });
};

// clears entire collection. Dangerous
var deleteAll = function(cb) {
    user.remove({}, function(err) {
        if (err) {
            console.error.log(err);
        }
        console.log('user store cleared');
        cb();
    });
};

var addUser = function(nsid, name, snum,cb) {
    var u = new user({name: name, nsid: nsid, snum: snum, quizzes: []});
    u.quizzes.push({name: 'testing', questionSet: []});
    quizdb.getQuestion(1, 'Practice-1', function(q) {
        u.quizzes[0]['questionSet'].push({myQuestion:q, answer:0, lastaccess: Date.now()});
        u.save(function(err, u) {
            if (err) return console.error(err);
            u.success();
            u.poplulate('myQuizSchema', function(e, p) {
                console.log ('populate returned ',e , p);
                u.print();
                cb();
            });
        });
    });
};

           


var userdb = {};
userdb.init = init;

module.exports = userdb;



