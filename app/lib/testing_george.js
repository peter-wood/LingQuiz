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
// @@webroot@@=/storage
// @@webdir@@=ling111
// @@nodeserver@@=http://linguistics.usask.ca
// @@nodeport@@=8080
// @@user@@=peter

module.exports = config;
