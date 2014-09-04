var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();

var currentRes;
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

var sendFile = function() {
    if (!dataValid) return;
	var file = JSON.parse(currentData)['file'];
	var resource = JSON.parse(currentData)['resource'];
    console.log('sendfile got: filename: %s, resource: %s' + file, resource);
    var resDir = config[resource];
    currentRes.download(resDir + file, function(err) {

       if (err) {
           console.log('Error: ' + err);
       } else {
           console.log('download started');
       }
    });
}


router.post('/', function(req, res) {
    console.log('download POST accessed');
    var key = req.cookies.LingKey;
    console.log('key: ' + key);
    auth.printAuth();
    if (!auth.hasPermission(key)) {
        res.json({'result': -1});
        return;
    }
    currentRes = res;
    currentData  = '';
    dataValid = true;
    req.on('data', receiveData);
    if (currentData.length > 255) error413() ;
    req.on('end', sendFile);
});

module.exports = router;

