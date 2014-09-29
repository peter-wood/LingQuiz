var config = {}
config.setup = 'sammy';
config.deployment = 'testing'; // testing uses a test database, production uses a life database
config.port = 8000;
config.slides = '/home/peter/nodejs/LingQuiz/app/resources/slides/';
config.handouts = '/home/peter/nodejs/LingQuiz/app/resources/handouts/';
config.book = '/home/peter/nodejs/LingQuiz/app/resources/book/';
config.db = 'V2';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = {
    'Practice-1': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'save': true, 'retake': true, 'review': true },
    'Quiz-1': { 'type': 'quiz', 'open': true, 'time': 5, 'numQuestions': 10, 'save': true, 'retake': false, 'review': false }
};
// @@webroot@@=/srv/http
// @@webdir@@=ling111
// @@nodeserver@@=http://localhost
// @@nodeport@@=8000
// @@user@@=http
Object.keys(config.quizzes).forEach( function(k) {
    console.log('Quiz: %s' , k, config.quizzes[k]);
});
module.exports = config;

