// authentication routines

var uuid = require('uuid');
var db = require('./userdb.js');
var config = require('./config.js');

var authenticated = {}; // holds all authenticated users

// look up user in database
// dummy for now
var inDb = function (user, pass, cb) {
	db.haveUser(user,pass, cb);
};

var inAuth = function (user) {
    for (key in authenticated) {
        if (user === authenticated[key].user) {
            extendAuth(key);
            console.log('user existed');
            return key;
        }
    }
    return false;
}

// add a user 
// to do: look up in db
var addKey = function(user, pass, cb) {
    var key;
	inDb(user, pass, function(result) {
       if (!result) {
           key = 'invalid'; 
           cb(key);
       }
       else if (inAuth(user)) {
           cb(inAuth(user)); 
       } else {
           var element = {
		        'user': user,
		        'pass': pass,
               'expires': Date.parse(Date()) + (config.loginValidFor * 60 * 1000) // expires after 10 min. of inactivity
	       }
	       key = uuid.v4();
           authenticated[key] = element;
	       printAuth();
           cb(key);
       }
  });
};


// purge all expired authentications
var purgeAuth = function() {
    console.log('purging auth db');
	var now = Date.parse(Date());
	for (key in authenticated) {
        console.log('key for user ' + authenticated[key].user + ' expires in: ' + (authenticated[key].expires - now) /1000);
		if (authenticated[key].expires < now) {
			delete authenticated[key];
		}
	}
};

var printAuth = function() {
	console.log("Auth module: " + JSON.stringify(authenticated));
};

// returns true if request has a valid authkey
var isAuthenticated = function(key) {
	if (authenticated[key]){ 
		extendAuth(key);
		return authenticated[key]; 
	} else {
		return false;
	}
};

// extend validity by 10 min
var extendAuth = function(key) {
	if (!authenticated[key]) {
		return false;
	}
	authenticated[key].expires = Date.parse(Date()) + (10 * 60 * 1000); 
	return true;
};

var auth = addKey;
auth.addKey = addKey;
auth.hasPermission = isAuthenticated;
auth.extendAuth = extendAuth;
auth.printAuth = printAuth;
auth.purgeAuth = purgeAuth;

module.exports = auth;
