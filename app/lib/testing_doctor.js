var config = {}
config.setup = 'beta testing on doctor';
config.deployment = 'production';
config.port = 8080;
config.slides = '/home/peter/Development/nodejs/LingQuiz/app/resources/slides/';
config.handouts = '/home/peter/Development/nodejs/LingQuiz/app/resources/handouts/';
config.book = '/home/peter/Development/nodejs/LingQuiz/app/resources/book/';
config.db = 'LingTestDoctor';
config.loginValidFor = 45; // in minutes
config.purgeInterval = 30; // in seconds
config.quizzes = {
    'Practice-1': { 'type': 'practice', 'open': true, 'time': 15, 'numQuestions': 10, 'retake': true, 'review': true },
    'Quiz-1': { 'type': 'quiz', 'open': true, 'time': 50, 'numQuestions': 30, 'retake': false, 'review': false }
};
// @@webroot@@=/var/www/localhost/htdocs
// @@webdir@@=Ling111_doctor
// @@nodeserver@@=http://localhost
// @@nodeport@@=8080
// @@user@@=apache

module.exports = config;

