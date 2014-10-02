var config = {}
config.setup = 'george';
config.deployment = 'production'; // testing uses a test database, production uses a life database
config.port = 8000;
config.slides = '/storage/nodejs/LingQuiz/app/resources/slides/';
config.handouts = '/storage/nodejs/LingQuiz/app/resources/handouts/';
config.book = '/storage/nodejs/LingQuiz/app/resources/book/';
config.db = 'Ling111PW';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = {
    'Practice-1': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'retake': true, 'review': true },
    'Quiz-1': { 'type': 'quiz', 'open': false, 'time': 50, 'numQuestions': 30, 'retake': false, 'review': false }
};
// @@webroot@@=/storage
// @@webdir@@=Ling111
// @@nodeserver@@=http://linguistics.usask.ca
// @@nodeport@@=8000
// @@user@@=peter

module.exports = config;
