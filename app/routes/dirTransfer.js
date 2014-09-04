var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();

var currentRes;

router.get('/', function(req, res) {
    var path = req.app.get('currentPath');
    var resource = path.substring(1,path.length);
    console.log(resource + ' GET accessed');
    var key = req.cookies.LingKey;
    console.log('key: ' + key);
    auth.printAuth();
    if (!auth.hasPermission(key)) {
	console.log('not authorized');
        res.json({'result': -1});
        return;
    }
    currentRes = res;
    fs.readdir(config[resource], sendDir);
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
