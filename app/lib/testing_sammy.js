var config = {}
config.setup = 'sammy';
config.deployment = 'production'; // testing uses a test database, production uses a life database
config.port = 8000;
config.slides = '/home/peter/nodejs/LingQuiz/app/resources/slides/';
config.handouts = '/home/peter/nodejs/LingQuiz/app/resources/handouts/';
config.book = '/home/peter/nodejs/LingQuiz/app/resources/book/';
config.db = 'Ling111PW';
config.currentQuestionSet = 'practice';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = [
    { 'quiz': 'Practice-1', 'open': true, time: 15, numQuestions: 10, save:false, retake: true, review: false },
    { 'quiz': 'Quiz-1', 'open': true, time: 5, numQuestions: 10, save: true, retake: false, review: false }
];
// @@webroot@@=/srv/http
// @@webdir@@=ling111
// @@nodeserver@@=http://localhost
// @@nodeport@@=8000
// @@user@@=http
module.exports = config;

