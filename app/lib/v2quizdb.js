var config = require('./config.js');

// mongoose.set('debug', true);

var quizSchema = mongoose.Schema( {
        number: Number,
        question: String,
        text: String,
        resource: String,
        opt1: String,
        opt2: String,
        opt3: String,
        opt4: String,
        opt5: String,
        correct: Number,
        qset: String},
        { 'collection': 'questions' } );


quizSchema.methods.check = function(answer) {
    return (this.correct === answer);
}

quizSchema.methods.print = function() {
    console.log('number: ', this.number); 
    console.log('qset: ', this.qset); 
    console.log('question: ', this.question); 
    console.log('text: ', this.text); 
    console.log('resource: ', this.resource); 
    console.log('opt1: ', this.opt1); 
    console.log('opt2: ', this.opt2); 
    console.log('opt3: ', this.opt3); 
    console.log('opt4: ', this.opt4); 
    console.log('opt5: ', this.opt5); 
    console.log('correct: ', this.correct); 
};

quizSchema.methods.getConf = function() {
    return config.quizzes[this.qset];
}

var initConf = function(cb) {
    var counter = Object.keys(config.quizzes).length;

    var reduce= function (qset, c){
        config.quizzes[qset]['total'] = c;
        counter--;
        if (counter === 0) {
            cb();
        }
    }

    Object.keys(config.quizzes).forEach( function(key) {
        questionModel.count({'qset': key}, function(err, c) {
            reduce(key, c);
        });
    });
}

var getQuizzes = function() {
    return config.quizzes;
}

var questionModel = mongoose.model('question', quizSchema);

var getQuestion = function(number, qset, cb) {
    questionModel.findOne(
                { 'qset': qset, 'number': number }, 
            function(err, question) {
                if (err) {
                    console.log('Could not get Question: ', number, qset, err);
                    cb(-1);
                } else {
                    cb(question);
                }
            });
}

var randset = function(min, max, n) {
    var mySet = [];
    var set = [];
    for (var x = min; x < max+1; ++x) {
        set.push(x);
    }
    for (x = 0; x < n; ++x) {
        var index = Math.floor(Math.random() * set.length);
        mySet.push(set.splice(index,1)[0]);
    }
    console.log('randset, min: %d, max: %d, n: %d, set: %s', min, max, n, mySet);
    return mySet;
}


var getRandomSet = function(qset, number, index, cb) {
    var ourSet = randset(1,config.quizzes[qset]['total'],number);
    var result = [];

    var reduce = function(question) {
        result.push(question);
        ourSet.splice(question['Number'], 1);
        if (ourSet.length === 0) {
            console.log('getRandomSet returning set of ', result.length);
            cb(result, index);
        } else {
            getQuestion(ourSet[0], qset, reduce);
        }
    }

    getQuestion(ourSet[0],qset,reduce);
}


var quizdb = {};
quizdb.getQuestion = getQuestion;
quizdb.getQuizzes = getQuizzes;
quizdb.getRandomSet = getRandomSet;
quizdb.initConf = initConf;
module.exports = quizdb;



