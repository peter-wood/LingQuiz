var config = {}
config.setup = 'doctor';
config.deployment = 'testing';
config.port = 8080;
config.slides = '/home/peter/Development/nodejs/LingQuiz/app/resources/slides/';
config.handouts = 'home/peter/Development/nodejs/LingQuiz/app/resources/handouts/';
config.book = 'home/peter/Development/nodejs/LingQuiz/app/resources/book/';
config.db = 'LingTesting';
// @@webroot@@=/var/www/localhost/htdocs
// @@webdir@@=Ling111_doctor
// @@nodeserver@@=http://localhost
// @@nodeport@@=8080
// @@user@@=apache

module.exports = config;
