var mongoose = require('mongoose');
var crypto = require('crypto');
var db;

var connect = function() {
    mongoose.connect('mongodb://localhost/LingTest');
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', console.log.bind(console, 'connection established'));
};

var mySchema = mongoose.Schema( {
    nsid: String,
    snum: Number,
    expires: Number,
    salt: String});

mySchema.methods.success = function() {
        console.log( 'saved record for ' + this.nsid);
};

var user = mongoose.model('User', mySchema);

var testingData = [
    {nsid: 'pew191', snum: 1234, expires: 1234, salt: 'salt1'},
    {nsid: 'aat123', snum: 5678, expires: 5678, salt: 'salt2'},
    {nsid: 'sts456', snum: 9012, expires: 9012, salt: 'salt3'}];


var init = function () {
    for (index = 0; index < testingData.length; ++index) {
        console.log('creating: ' + JSON.stringify(testingData[index]));
        addUser(testingData[index].nsid,
            testingData[index].snum,
            testingData[index].expires,
            testingData[index].salt);
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

var haveUser = function(nsid, pass, cb) {
    var u = user.findOne({nsid: nsid})
        .select('snum')
        .exec(function(err, u) {
            console.log('db lookup for: ' + nsid + ' = ' + u.snum);
            if (err) cb(false);
            if (u.length === 0) cb (false);
            var myNum = crypto.createHash('md5');
            myNum.update(pass);
            if (myNum.digest('hex') != pass)  cb(false);
            console.log('db found user');
            cb (true);
            });
    }

            


var mongo = connect;
mongo.connect = connect;
mongo.init = init;
mongo.printAll = printAll;
mongo.deleteAll = deleteAll;
mongo.haveUser = haveUser;

module.exports = mongo;



