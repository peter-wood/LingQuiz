var crypto = require('crypto');
var quizdb = require('./v2quizdb');
var config = require('./config');
// mongoose.set('debug', true);
//


var myQuestionSchema = mongoose.Schema( {
    myQuestion: {type: mongoose.Schema.Types.ObjectId, ref: 'question'},
    answer: {type: Number, default: 0},
    lastaccess: {type: Date, default: Date.now}});

myQuestionSchema.methods.print = function() {
    console.log('Question: ') // , this.myQuestion);
    this.myQuestion.print();
    console.log('Answer: ', this.answer);
    console.log('Last Access: ', this.lastaccess);
    console.log('Config: ', this.myQuestion.getConf());
}

var myQuizSchema = mongoose.Schema( {
    name: String,
    type: String,
    open: Boolean,
    attempt: Number,
    time: Number,
    started: Date,
    numQuestions: Number,
    completed: Boolean,
    canResume: Boolean,
    canRetake: Boolean,
    canReview: Boolean,
    questionSet: [myQuestionSchema],
} );

myQuizSchema.methods.print = function() {
    console.log('Name: ', this.name);
    console.log('type: ', this.type);
    console.log('open: ', this.open);
    console.log('attempt: ', this.attempt);
    console.log('time: ', this.time);
    console.log('started: ', this.started);
    console.log('numQuestions: ', this.numQuestions);
    console.log('completed: ', this.completed);
    console.log('canResume: ', this.canResume);
    console.log('canRetake: ', this.canRetake);
    console.log('canReview: ', this.canReview);
    console.log('Questions: ');
    if (! this.questionSet) {
        return;
    }
    for (var q = 0; q < this.questionSet.length; ++q) {
        this.questionSet[q].print();
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

var saveUser = function(u,cb) {
    u.populate('quizzes.questionSet.myQuestion', function(err, p) {
            if (err) {
                // console.log ('populate returned ',err , p);
            }
            else {
                u.save(function(err, u) {
                if (err) return console.error(err);
                u.success();
                // u.print();
                cb(u);
                });
            }
    });
}

var addUser = function(nsid, name, snum,cb) {
    var u = new user({name: name, nsid: nsid, snum: snum, quizzes: []});
    u.quizzes.push({name: 'testing', questionSet: []});
    quizdb.getQuestion(1, 'Practice-1', function(q) {
        u.quizzes[0]['questionSet'].push({myQuestion:q, answer:0, lastaccess: Date.now()});
        saveUser(u, cb);
        });
};

var printAll = function() {
    user.find({}, function(err, all) {
        if (err) {
            console.log('error getting user records for printing');
            return;
        } else {
            for (var x = 0; x < all.length; ++x) {
                all[x].print();
            }
        }
    });
}


var get = function(nsid, cb) {
    user.findOne({'nsid': nsid}, function(err, u) {
        if (err) {
            console.log('Error: ', err, u);
            cb(false);
        } else {
            u.populate('quizzes.questionSet.myQuestion', function(err, p) {
                if (err) {
                    console.log ('populate returned ',err , p);
                }
                else {
                 cb(u);
                }
            });
        }
    });
}

var modQuestion = function(nsid, index, number, answer, cb) {
    get(nsid, function(u) {
        result = {};
        u['quizzes'][index]['questionSet'][number]['answer'] = answer;
        u['quizzes'][index]['questionSet'][number]['lastaccess'] = Date.now();
        if (u['quizzes'][index]['canReview']) {
            result.correct = u['quizzes'][index]['questionSet'][number]['myQuestion'].check(answer);
        }
        result.updated = 1;
        saveUser(u, function(u) {
            u['quizzes'][index].print();
            cb(0, result);
        });
    });
}
        





var getSet = function(nsid, index, cb) {
    console.log('get set called with: ', nsid, index);
    get(nsid, function(u) {
        result = [];
        for (var x = 0; x < u['quizzes'][index]['questionSet'].length; ++x) {
            obj = {};
            obj.number = u['quizzes'][index]['questionSet'][x]['myQuestion']['number'];
            obj.qset = u['quizzes'][index]['questionSet'][x]['myQuestion']['qset'];
            obj.question = u['quizzes'][index]['questionSet'][x]['myQuestion']['question'];
            obj.text = u['quizzes'][index]['questionSet'][x]['myQuestion']['text'];
            obj.resource = u['quizzes'][index]['questionSet'][x]['myQuestion']['resource'];
            obj.opt1 = u['quizzes'][index]['questionSet'][x]['myQuestion']['opt1'];
            obj.opt2 = u['quizzes'][index]['questionSet'][x]['myQuestion']['opt2'];
            obj.opt3 = u['quizzes'][index]['questionSet'][x]['myQuestion']['opt3'];
            obj.opt4 = u['quizzes'][index]['questionSet'][x]['myQuestion']['opt4'];
            obj.opt5 = u['quizzes'][index]['questionSet'][x]['myQuestion']['opt5'];
            obj.answer = u['quizzes'][index]['questionSet'][x]['answer'];
            result.push(obj);
        }
        cb(0, result);
    });
}


var getQuizzes = function(nsid, cb) {

   var send = function() {
       console.log('userdb.getQuizzes saving record'); 
       // console.log(currUser);
       saveUser(currUser, function(u) {
           // console.log('save returned: ************** ', u);
           var result = [];
           for (var x = 0; x < u.quizzes.length; ++x) {
               var obj = {};
               obj.name = u.quizzes[x]['name'];
               obj.index = x;
               obj.type = u.quizzes[x]['type'];
               obj.open = u.quizzes[x]['open'];
               obj.attempt = u.quizzes[x]['attempt'];
               obj.time = u.quizzes[x]['time'];
               obj.started = u.quizzes[x]['started'];
               obj.numQuestions = u.quizzes[x]['numQuestions'];
               obj.total = u.quizzes[x]['total'];
               obj.completed = u.quizzes[x]['completed'];
               obj.canResume = u.quizzes[x]['canResume'];
               obj.canRetake = u.quizzes[x]['canRetake'];
               obj.canReview = u.quizzes[x]['canReview'];
               result.push(obj);
           }
           // console.log('leaving getQuizzes, sending: ', result);
           cb({'result': result});
      });
   }

   var toAdd = [];
   var currUser = null;

   var fill = function(obj) {
       // console.log('in fill', obj);
        quizdb.getRandomSet(obj['qset'], obj['n'], obj['index'], getRes);
    }
    
   var getRes = function(questions, index) {
       // console.log('in getRes', toAdd);
       for (var x = 0; x < questions.length; ++ x) {
           // console.log('adding question: ', questions[x]);
           currUser['quizzes'][index]['questionSet'].push({'myQuestion': questions[x], 'answer': 0, 'lastaccessed': Date.now()});
           // console.log('questionSet length: ', currUser['quizzes'][index]['questionSet'].length);
       }
       toAdd.splice(0,1);
       if (toAdd.length === 0) {
           send();
        } else {
           fill(toAdd[0]);
       }
   }

   var update = function(u, index, key) {
        console.log('in userdb.getQuizzes.update');
        u['quizzes'][index]['name'] = key;
        u['quizzes'][index]['type'] = all[key]['type'];
        u['quizzes'][index]['open'] = all[key]['open'];
        u['quizzes'][index]['time'] = all[key]['time'];
        u['quizzes'][index]['numQuestions'] = all[key]['numQuestions'];
        u['quizzes'][index]['canRetake'] = all[key]['retake'];
        u['quizzes'][index]['canReview'] = all[key]['review'];
         
   }

    console.log('in userdb.getQuizzes');
    var all = quizdb.getQuizzes();
    get(nsid, function(u) {
        currUser = u;
        Object.keys(all).forEach( function(key) {
            var found = false;
            for (var x = 0; x < u.quizzes.length; ++x) {
                if (u.quizzes[x]['name'] === key) {
                    found = true;
                    update(u, x, key);
                }
            }
            if (!found) {
                u.quizzes.push({'name': key, questionSet: []});
                update(u, u.quizzes.length - 1, key);
                u['quizzes'][u.quizzes.length - 1]['attempt'] = 0;
                u['quizzes'][u.quizzes.length - 1]['started'] = -1;
                u['quizzes'][u.quizzes.length - 1]['completed'] = false;
                u['quizzes'][u.quizzes.length - 1]['canResume'] = true;
                toAdd.push({index: u.quizzes.length - 1, 'qset': key, 'n': all[key]['numQuestions']});
           }
        });
        if (toAdd.length === 0) { 
            send(); 
        } else {
            fill(toAdd[0]);
        }
    });

    
}
    
var haveUser = function(nsid, pass, cb) {
    console.log('haveUser called with nsid: %s, and pass: %s', nsid, pass);
    get(nsid, function(u) {
        var result = false;
        if (u != null ) {
            console.log('found snum: %s for nsid: %s',  u.snum, u.nsid);
            var myNum = crypto.createHash('md5')
                .update(String(u.snum), 'utf8')
                .digest('hex'); 
            console.log('my md5: %s', myNum);
            if (myNum === pass) {
                result = true;
                console.log('db found user');
            }
        }
        cb(result);
    });
}

           


var userdb = {};
userdb.init = init;
userdb.haveUser = haveUser;
userdb.printAll = printAll;
userdb.getQuizzes = getQuizzes;
userdb.getSet = getSet;
userdb.modQuestion = modQuestion;

module.exports = userdb;



