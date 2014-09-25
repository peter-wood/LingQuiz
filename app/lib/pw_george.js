var config = {}
config.setup = 'george';
config.deployment = 'testing'; // testing uses a test database, production uses a life database
config.port = 8000;
config.slides = '/storage/nodejs/LingQuiz/app/resources/slides/';
config.handouts = '/storage/nodejs/LingQuiz/app/resources/handouts/';
config.book = '/storage/nodejs/LingQuiz/app/resources/book/';
config.db = 'Ling111PW';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = [
    { 'quiz': 'Practice-1', 'open': true, time: 15, numQuestions: 10, save:false, retake: true },
    { 'quiz': 'Quiz-1', 'open': false, time: 50, numQuestions: 30, save: true, retake: false }
];
// @@webroot@@=/storage
// @@webdir@@=ling111_testing
// @@nodeserver@@=http://linguistics.usask.ca
// @@nodeport@@=8000
// @@user@@=peter

module.exports = config;
