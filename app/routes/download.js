var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();

var currentRes;

var sendFile = function(file, resource) {
    console.log('sendfile got: filename: %s, resource: %s',file, resource);
    var resDir = config[resource];
    console.log('attempt download from path: %s', resDir);
    fs.readFile(resDir + file, function (err, data) {
        var base64data = new Buffer(data).toString('base64');
        currentRes.jsonp({result: base64data});
    });
    
   // currentRes.download(resDir + file, function(err) {
    //   if (err) {
     //      console.log('Error: ' + err);
      // } else {
       //    console.log('download started');
      // }
   // });
}


router.get('/', function(req, res) {
    console.log('download accessed');
    var key = req.cookies.LingKey;
    console.log('key: ' + key);
    auth.printAuth();
    if (!auth.hasPermission(key)) {
        res.jsonp({'result': -1});
        return;
    }
    currentRes = res;
    var file = req.param('file');
    var resource = req.param('resource');
    console.log('resource: %s, file: %s', resource, file);
    sendFile(file, resource);
});

module.exports = router;

