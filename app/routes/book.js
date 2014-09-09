var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();


router.get('/', function(req, res) {
    console.log('book GET accessed');
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    if (!auth.hasPermission(key)) {
	console.log('not authorized');
        res.jsonp({'result': -1});
        return;
    }
    currentRes = res;
    fs.readdir(config['book'], sendDir);
});


var sendDir = function(err, dir) {
    if (err) {
        currentRes.jsonp({'error': err});
        return;
    } else {
        var json = {'result': dir};
        currentRes.jsonp(json);
    }
}


module.exports = router;
