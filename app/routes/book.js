var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();
var currentRes = null;
var result = null;


router.get('/', function(req, res) {
    console.log('book GET accessed');
    currentRes = res;
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    if (!auth.hasPermission(key)) {
	console.log('not authorized');
        result = {'result': -1};
        sendResult();
    } else {
      console.log('authorized :-)');
      fs.readdir(config['book'], sendDir);
    }
});


var sendResult = function() {
  if (currentRes==null) {
    console.log('respponse already send');
    return;
  }
  console.log('sending result: %s', JSON.stringify(result));
  currentRes.jsonp(result);
  currentRes = null;
}

var sendDir = function(err, dir) {
    if (err) {
        console.log('error in sendDir');
        result = {'error: ' : err};
    } else {
      console.log('sendDir success');
      // only files ending in pdf
      var returnvalue = [];
      var reg = /\.pdf$/;
      for (var i = 0; i < dir.length; ++i) {
        if (reg.test(dir[i])) {
          returnvalue.push(dir[i].replace(reg,''));
        }
      }
      result = {'result': returnvalue};
    }
    sendResult();
}


module.exports = router;
