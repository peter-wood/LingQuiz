var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var quizdb = require('../lib/quizdb.js');
var userdb = require('../lib/userdb.js');
var router = express.Router();
var result = {};
var currentRes = null;
var collection = null;
var id = null;
var answer = null;


router.get('/', function(req, res) {
    console.log('check GET accessed');
    currentRes = res;
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    var authdata = auth.hasPermission(key);
    if (!authdata) {
	console.log('not authorized');
        result = -1;
        send(0, result);
    } else {
      console.log('authorized :-)');
      var data =JSON.parse(req.query.data);
      console.log('check got: ', data);
      collection = data.quiz;
      id = data.id;
      answer = data.answer;
      if (data.save === true) {
          send(0, false);
      } else {
          quizdb.checkAnswer(collection, id, answer, send);
      }
    }
});

var send = function(err, result) {
    if (currentRes === null) {
        console.log('resutlt already sent');
        return;
    }
    var data = {};
    data.result = result;
    console.log('sending result: %s', JSON.stringify(data));
    currentRes.jsonp(data);
    currentRes = null;
}

module.exports = router;
