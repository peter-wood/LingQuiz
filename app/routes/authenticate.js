var express = require('express');
var auth = require('../lib/auth.js');
var router = express.Router();

var currentRes = null;

// POST request too large

var genKey = function(nsid, snum) {
    console.log('auth got: ' + nsid + ', ' + snum);
    auth.addKey(nsid, snum, sendKey);
}

var sendKey = function(key) {
    if (key==='invalid') {			// got no key :-(
            console.log('User not found in db');
        } else { 			// got valid key :-)
            console.log('User found in db');
        }
    console.log('returning authkey: ' + key);
    if (currentRes) {
	    currentRes.setHeader('Set-Cookie', 'myLingKey=' + key);
	    currentRes.jsonp({'key': key});
	    currentRes = null;
    }
}


router.get('/', function(req, res) {
    currentRes = res;
    console.log('auth accessed');
    var nsid = req.param('nsid');
    var snum = req.param('pass');
    genKey(nsid, snum);
});

module.exports = router;
