var express = require('express');
var auth = require('../lib/auth.js');
var router = express.Router();

var currentRes = null;
var currentData = '';
var dataValid = true;

// POST request too large
var error413 = function() {
    console.log('too much stuff coming in');
    currentRes.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
    currentRes.end('<!doctype html><html><body>Sorry</body></html>');
    dataValid = false;
}

var receiveData = function(d) {
    if (currentData.length > 255) error413(res) ;
    else {
        currentData += d;
    }
}

var genKey = function() {
    if (!dataValid) return;
	var nsid = JSON.parse(currentData)['nsid'];
    var snum = JSON.parse(currentData)['pass'];
    console.log('auth got: ' + nsid + ', ' + snum);
    auth.addKey(nsid, snum, sendKey);
}

var sendKey = function(key) {
    if (key==='invalid') {			// got no key :-(
            currentRes.cookie.LingKey = 'invalid';
            console.log('User not found in db');
        } else { 			// got valid key :-)
            currentRes.cookie.LingKey = key;
            console.log('User found in db');
        }
    console.log('returning authkey: ' + key);
    currentRes.writeHead(200, {'Content-Type': 'text/html'});
    currentRes.end('<!doctype html><html><body>key:' + key + '</body></html>');
}


router.post('/', function(req, res) {
    currentRes = res;
    currentData  = '';
    dataValid = true;
    console.log('auth accessed');
    req.on('data', receiveData);
    if (currentData.length > 255) error413() ;
    req.on('end', genKey);
});

module.exports = router;
