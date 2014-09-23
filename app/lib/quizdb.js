var config = require('./config.js');

// mongoose.set('debug', true);

var setSchema = function(collection) {
    return mongoose.Schema( {
        question: String,
        text: String,
        resource: String,
        opt1: String,
        opt2: String,
        opt3: String,
        opt4: String,
        opt5: String,
        correct: Number,
        id: Number},
        { 'collection': collection } );
}
var modelcache = {}

var setModel = function(collection) {
    //console.log('looking for model: %s', collection);
    if (modelcache.hasOwnProperty(collection)) {
        //console.log('found');
        return modelcache[collection];
    } else {
        console.log('not found');
        var c = mongoose.model(collection, setSchema(collection));
        modelcache[collection] = c;
        return c;
    }
}

var getLength = function(collection, cb) {
    var question = setModel(collection);
	question.count({}, cb);
}

var checkAnswer = function(collection, id, answer, cb) {
    var question = setModel(collection);
    question.findOne({'id': id}, function(err, q) {
        if (err) {
            console.log('checkAnswer ran into a problem');
            cb(0, -1);
        } else {
            //console.log('checkAnswer got: ', q);
            var result;
            if (q.correct === answer) { 
                result = true;
            } else {
                result = false;
            }
            console.log('returning: ',result);
            cb(0, result);
        }
    }); 
}
    


var getQuestion = function(collection, number, cb) {
    var question = setModel(collection);
	question.find({id: number})
	.select('question text resource opt1 opt2 opt3 opt4 opt5 correct id')
	.exec(function(err, questions) {
		if (err) cb(err, -1);
		if (questions.length === 0) {
			console.error('no matching questions found');
			cb (-1, -1);
		}
        cb(0, questions[0]);
	});
}


var quizdb = {};
quizdb.getQuestion = getQuestion;
quizdb.getCount = getLength;
quizdb.checkAnswer = checkAnswer;

module.exports = quizdb;



