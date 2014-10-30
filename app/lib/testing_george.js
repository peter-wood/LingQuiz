var config = {}
config.setup = 'george';
config.deployment = 'production'; // testing uses a test database, production uses a life database
config.port = 8080;
config.slides = '/storage/nodejs/LingTesting/app/resources/slides/';
config.handouts = '/storage/nodejs/LingTesting/app/resources/handouts/';
config.book = '/storage/nodejs/LingTesting/app/resources/book/';
config.db = 'LingTesting';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = {
    'Practice-1': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'retake': true, 'review': true },
    'Practice-2': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'retake': true, 'review': true },
    'Practice-3': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'retake': true, 'review': true },
    'Quiz-1': { 'type': 'quiz', 'open': true, 'time': 50, 'numQuestions': 30, 'retake': false, 'review': true },
    'Quiz-2': { 'type': 'quiz', 'open': true, 'time': 50, 'numQuestions': 30, 'retake': false, 'review': true },
    'Quiz-3': { 'type': 'quiz', 'open': true, 'time': 50, 'numQuestions': 30, 'retake': false, 'review': true },
    'Quiz-3-Retake': { 'type': 'quiz', 'open': true, 'time': 50, 'numQuestions': 30, 'retake': true, 'review': true }
};
// @@webroot@@=/storage
// @@webdir@@=ling111_testing
// @@nodeserver@@=http://linguistics.usask.ca
// @@nodeport@@=8080
// @@user@@=peter

module.exports = config;
