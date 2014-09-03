var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
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
    console.log('sendfile got: ' + file);
    // actually need to send a file :-)
    currentRes.download('/storage/nodejs/LingQuiz/app/resources/' + file, function(err) {
    //currentRes.download('/home/peter/nodejs/LingQuiz/app/resources/' + file, function(err) {

       if (err) {
           console.log('Error: ' + err);
       } else {
           console.log('download started');
       }
    });
}


router.post('/', function(req, res) {
    console.log('download POST accessed');
    var id = req.params.id;
    console.log('id = %s', id);
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

