var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();
var currentRes = null;
var result = null;

router.get('/', function(req, res) {
    console.log('quizzes GET accessed');
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
      sendList();
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


var sendList = function() {
  if (currentRes==null) {
    console.log('respponse already send');
    return;
  }
  myList = [];
  for (var x in config.quizzes) {
      if (config.quizzes[x]['open'] === true) {
          myList.push(config.quizzes[x]['quiz']);
      }
  }
  result = {'result': myList};
  sendResult();
}
module.exports = router;
