var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var router = express.Router();

var currentRes;

router.get('/', function(req, res) {
    console.log('resources GET accessed');
    var key = req.cookies.LingKey;
    console.log('key: ' + key);
    auth.printAuth();
    if (!auth.hasPermission(key)) {
        res.json({'result': -1});
        return;
    }
    currentRes = res;
    fs.readdir('/home/peter/nodejs/LingQuiz/app/resources', sendDir);
});


var sendDir = function(err, dir) {
    if (err) {
        currentRes.end('error: ', err);
        return;
    }
    var json = {'result': dir};
    currentRes.json(json);
}


module.exports = router;
