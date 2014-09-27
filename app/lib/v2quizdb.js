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

quizSchema.methods.count = function(cb) {
    this.model('question').count({set: this.set}, cb);
};

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


var questionModel = mongoose.model('question', quizSchema);

var getQuestion = function(number, qset, cb) {
    questionModel.findOne(
                { 'qset': qset, 'number': number }, 
            function(err, question) {
                if (err) {
                    console.log('Could not get Question: ', number, set, err);
                    cb(-1);
                } else {
                    cb(question);
                }
            });
}

var quizdb = {};
quizdb.getQuestion = getQuestion;
module.exports = quizdb;



