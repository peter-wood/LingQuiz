var mongoose = require('mongoose');
var crypto = require('crypto');
var db;

var connect = function() {
    mongoose.connect('mongodb://localhost/LingTest');
    db = mongoose.connection;
    db.on('error', console.log.bind(console, 'connection error:'));
    db.once('open', console.log.bind(console, 'connection established'));
};

var mySchema = mongoose.Schema( {
    nsid: String,
    snum: Number,
    quizzes: Object,
    reserved: Object});

mySchema.methods.success = function() {
        console.log( 'saved record for ' + this.nsid);
};

var user = mongoose.model('User', mySchema);

var testingData = [
    {nsid: 'pew191', snum: 1234, quizzes: null, reserved: null},
    {nsid: 'aat123', snum: 5678, quizzes: {test: 5678}, reserved: {test: 'salt2'}},
    {nsid: 'sts456', snum: 9012, quizzes: null, reserved: null}];


var init = function () {
    for (index = 0; index < testingData.length; ++index) {
        console.log('creating: ' + JSON.stringify(testingData[index]));
        addUser(testingData[index].nsid,
            testingData[index].snum,
            testingData[index].quizzes,
            testingData[index].reserved);
    };
};

var deleteAll = function() {
    user.remove({}, function(err) {
        if (err) {
            console.error.log(err);
        }
        console.log('user store cleared');
    });
};

var printAll = function() {
    user.find()
        .select('nsid snum')
        .exec(function(err, users) {
            if (err) return console.error(err);
            if (users.length === 0) {
                console.log('user store is empty.');
                return false;
            }
            for(i = 0; i < users.length; ++i) {
                console.log('%s, %s', users[i].nsid, users[i].snum);
            }
    });
};


var addUser = function(nsid, snum, expires, salt) {
    var u = new user({nsid: nsid, snum: snum, expires: expires, salt:salt});
    u.save(function(err, u) {
        if (err) return console.error(err);
        u.success();
    });
};

// holds address for current callback function (not very ellegant)
var currentCallback = null;
var currentPass = null;

// helper function for haveUser()
var checkPass = function(err, u) {
    console.log('in checkPass');
    var result = false;
    if (err === null && u != null ) {
        console.log('found snum: %s for nsid: %s',  u.snum, u.nsid);
        var myNum = crypto.createHash('md5')
            .update(String(u.snum), 'utf8')
            .digest('hex'); 
        console.log('my md5: %s', myNum);
        if (myNum === currentPass) {
            result = true;
            console.log('db found user');
        }
    }
    currentCallback (result);
}

var haveUser = function(nsid, pass, cb) {
    currentCallback = cb;
    currentPass = pass;
    console.log('haveUser called with nsid: %s, and pass: %s', nsid, pass);
    var query = user.findOne({nsid: nsid});
    query.select('nsid snum');
    query.exec(checkPass);
}

            


var mongo = connect;
mongo.connect = connect;
mongo.init = init;
mongo.printAll = printAll;
mongo.deleteAll = deleteAll;
mongo.haveUser = haveUser;

module.exports = mongo;



