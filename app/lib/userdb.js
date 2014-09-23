var crypto = require('crypto');
var config = require('./config');
// mongoose.set('debug', true);

var addQuestion = function(userName, collection, id, correct, answer, date, hash, callback) {
    user.findOne({nsid: userName}, function(err, u) {
        if (err) {
            console.log('Could not find user to add to');
            cb (err, -1);
        } else {
            u.quizzes.push( {'coll': collection,
                'question': id,
                'correct': correct,
                'answer': answer,
                'time': date,
                'setHash': hash});
            u.save(function(err) {
                callback(err, id);});
        }
    });
}

var modQuestion = function(userName, collection, id, hash, answer, cb) {
    console.log('-----------------mod Question called with: ', userName, collection, id, hash, answer);
    user.update(
            { 'nsid': userName,
                quizzes:  { $elemMatch: {
                    'coll': collection,
                    'question': id,
                    'setHash': hash}
                }
            },
            { $set: { 'quizzes.$.answer': answer }},
            cb
    );
    //u.save(function(err) {
    //    console.log('Error updating answers', err);
    //    cb(err, id);
    //});
}

var recordSchema = mongoose.Schema( {
    coll: String,
    question: Number,
    correct: Number,
    answer: Number,
    time: { type: Date, default: Date.now},
    setHash: Number});

var userSchema = mongoose.Schema( {
    name: String,
    nsid: String,
    snum: Number,
    quizzes: [recordSchema],
    reserved: Object});

userSchema.methods.success = function() {
        console.log( 'saved record for ' + this.nsid);
};

var user = mongoose.model('User', userSchema);

var testingData = [
    {name: 'peter', nsid: 'pew191', snum: 1234},
    {name: 'anita', nsid: 'aat123', snum: 5678},
    {name: 'john doe', nsid: 'sts456', snum: 9012}];


// In testing only: Populate database with dummy entries.
var init = function () {
    if(config.deployment != 'testing')
	    return;
    deleteAll();
    for (index = 0; index < testingData.length; ++index) {
        console.log('creating: ' + JSON.stringify(testingData[index]));
        addUser( 
            testingData[index].nsid, 
            testingData[index].name,
            testingData[index].snum);
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

var addUser = function(nsid, name, snum) {
    var u = new user({name: name, nsid: nsid, snum: snum});
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

var mycb = null;

var dump = function(err, u) {
    attempts = [];
    for (var x = 0; x < u.quizzes.length; ++x) {
        attempts.push(u.quizzes[x]['setHash']);
    }
    attempts.sort();
    last = attempts.pop();
    console.log('dump last entry: ', last);
    questions = {};
    for (var x = 0; x < u.quizzes.length; ++x) {
        if (u.quizzes[x]['setHash'] === last) {
            questions[u.quizzes[x]['question'].toString()] = u.quizzes[x];
            //console.log(questions);
        }
    }
    var total = 0;
    Object.keys(questions).forEach(function(x) {
        console.log('question: %d, correct: %d, answer: %d', questions[x]['question'], questions[x]['correct'], questions[x]['answer']);
        if (questions[x]['correct'] === questions[x]['answer']) { ++total; }
    });
    console.log('Total: %s', total);

    mycb();
}

var dumpData = function(nsid, cb) {
    mycb = cb;
    var query = user.findOne({'nsid': nsid});
    query.select('quizzes');
    query.exec(dump);
}

var haveUser = function(nsid, pass, cb) {
    currentCallback = cb;
    currentPass = pass;
    console.log('haveUser called with nsid: %s, and pass: %s', nsid, pass);
    var query = user.findOne({'nsid': nsid});
    query.select('nsid snum');
    query.exec(checkPass);
}

            


var userdb = {};
userdb.init = init;
userdb.printAll = printAll;
userdb.deleteAll = deleteAll;
userdb.haveUser = haveUser;
userdb.addQuestion = addQuestion;
userdb.modQuestion = modQuestion;
userdb.dumpData = dumpData;

module.exports = userdb;



