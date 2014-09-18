var config = require('./config.js');

mongoose.set('debug', true);
var questionSchema = mongoose.Schema( {
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
    { collection: config.currentQuestionSet } );

var question = mongoose.model(config.currentQuestionSet, questionSchema);

var questionCache = [];

var getQuestions = function(cb) {
	question.find()
	.select('question text resource opt1 opt2 opt3 opt4 opt5 correct id')
	.exec(function(err, questions) {
		if (err) return console.error(err);
		if (questions.length === 0) {
			console.error('no matching questions found');
			return false;
		}
		for (var i = 0; i < questions.length; ++i) {
            var temp = {};
			temp.question = questions[i].question;
			temp.text = questions[i].text;
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

var quizdb = {};
quizdb.getQuestion = getOneQuestion;

module.exports = quizdb;



