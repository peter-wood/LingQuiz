// authentication routines

var uuid = require('uuid');
var db = require('./db.js');

var authenticated = {}; // holds all authenticated users

// look up user in database
// dummy for now
var inDb = function (user, pass, cb) {
	db.haveUser(user,pass, cb);
};


// add a user 
// to do: look up in db
var addKey = function(user, pass, cb) {
    var key;
	inDb(user, pass, function(result) {
       if (!result) key = 'invalid'; 
       else {
           var element = {
		        'user': user,
		        'pass': pass,
                'expires': Date.parse(Date()) + (10 * 60 * 1000) // expires after 10 min. of inactivity
	       }
	       key = uuid.v4();
           authenticated[key] = element;
	       printAuth();
       }
  cb(key);
  });
};


// purge all expired authentications
var purgeAuth = function() {
	var now = Date.parse(Date());
	for (key in authenticated) {
		if (key[expires] < now) {
			delete authenticated[key];
		}
	}
};

var printAuth = function() {
	console.log("Auth module: " + JSON.stringify(authenticated));
};

// returns true if request has a valid authkey
var isAuthenticated = function(key) {
	purgeAuth();
	if (authenticated[key]){ 
		return true; 
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

module.exports = auth;
