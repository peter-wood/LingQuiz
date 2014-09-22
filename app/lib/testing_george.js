var config = {}
config.setup = 'george';
config.deployment = 'testing'; // testing uses a test database, production uses a life database
config.port = 8080;
config.slides = '/storage/nodejs/LingTesting/app/resources/slides/';
config.handouts = '/storage/nodejs/LingTesting/app/resources/handouts/';
config.book = '/storage/nodejs/LingTesting/app/resources/book/';
config.db = 'LingTesting';
config.currentQuestionSet = 'samplequestions';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = [
    { 'quiz': 'Practice-1', 'open': true, time: 15, numQuestions: 10, save:false, retake: true },
    { 'quiz': 'Quiz-1', 'open': false, time: 50, numQuestions: 30, save: true, retake: false }
];
// @@webroot@@=/storage
// @@webdir@@=ling111
// @@nodeserver@@=http://linguistics.usask.ca
// @@nodeport@@=8080
// @@user@@=peter

module.exports = config;
