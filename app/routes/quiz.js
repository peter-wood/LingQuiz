var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var quizdb = require('../lib/quizdb.js');
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
        result = -1;
        sendQuestion(result);
    } else {
      console.log('authorized :-)');
      getQuestion();
    }
});

var sendQuestion = function(data) {
  result = {'result': data};
  console.log('sending result: %s', JSON.stringify(result));
  currentRes.jsonp(result);
  currentRes = null;
}

var getQuestion = function() {
  if (currentRes==null) {
    console.log('respponse already send');
    return;
  }
  quizdb.getQuestion(sendQuestion);
}

module.exports = router;
