var config = {}
config.setup = 'george';
config.deployment = 'production'; // testing uses a test database, production uses a life database
config.port = 8008;
config.slides = '/storage/nodejs/VMQuiz/app/resources/slides/';
config.handouts = '/storage/nodejs/VMQuiz/app/resources/handouts/';
config.book = '/storage/nodejs/VMQuiz/app/resources/book/';
config.db = 'Ling111VM';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = {
    'Practice-1': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'retake': true, 'review': true },
    'Quiz-1': { 'type': 'quiz', 'open': false, 'time': 50, 'numQuestions': 30, 'retake': false, 'review': true }
};
// @@webroot@@=/storage
// @@webdir@@=Ling111_VM
// @@nodeserver@@=http://linguistics.usask.ca
// @@nodeport@@=8008
// @@user@@=peter

module.exports = config;
