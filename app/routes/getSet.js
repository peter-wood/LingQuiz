var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var quizdb = require('../lib/quizdb.js');
var userdb = require('../lib/userdb.js');
var router = express.Router();
var result = {};
var currentRes = null;
var user = null;
var collection = null;


router.get('/', function(req, res) {
    console.log('getSet GET accessed');
    currentRes = res;
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    var authdata = auth.hasPermission(key);
    if (!authdata) {
	console.log('not authorized');
        result = -1;
        sendQuestions(0, result);
    } else {
      console.log('authorized :-)');
      var data =JSON.parse(req.query.data);
      user = authdata.user;
      collection = data.which;
      var index = -1;
      for (var x = 0; x < config.quizzes.length; ++x) {
          if (config.quizzes[x].quiz === data.which) {
              index = x;
              break;
          }
      }
      result.open = config.quizzes[index].open;
      result.time = config.quizzes[index].time;
      result.numQuestions = config.quizzes[index].numQuestions;
      result.retake = config.quizzes[index].retake;
      result.save = config.quizzes[index].save;
      result.hash = Date.parse(Date());
      result.questions = [];
      quizdb.getCount(data.which, addQuestions);
    }
});

var randset = function(min, max, n) {
    var mySet = [];
    var set = [];
    for (var x = min; x < max+1; ++x) {
        set.push(x);
    }
    for (x = 0; x < n; ++x) {
        var index = Math.floor(Math.random() * set.length);
        mySet.push(set.splice(index,1)[0]);
    }
    console.log('randset, min: %d, max: %d, n: %d, set: %s', min, max, n, mySet);
    return mySet;
}

var set = null;

var sendQuestions = function(err, data) {
    if (currentRes === null) {
        console.log('resutlt already sent');
        return;
    }
    // console.log('sending result: %s', JSON.stringify(data));
    currentRes.jsonp(data);
    currentRes = null;
}


var reduceCounter = function(err, questionid) {
    if (err) {
        console.log('Could not store question');
        return;
    }
    // console.log('in reduceCounter: %s', set);
    set.splice(set.indexOf(questionid), 1);
    if (set.length > 0) {
        // console.log('reduceCounter after splice: %s', set, set.length);
        getQuestion();
    } else {
        sendQuestions(0, result);
    }
}

var storeQuestion = function(question) {
     // var q = Object.create(question);
     var q = {};
     q.question = question.question;
     q.text = question.text;
     q.opt1 = question.opt1;
     q.opt2 = question.opt2;
     q.opt3 = question.opt3;
     q.opt4 = question.opt4;
     q.opt5 = question.opt5;
     q.id = question.id;
     q.resource = question.resource;
     q.correct = false;
     q.answer = 0;
     // console.log('in store question: ', q);
     var correct = question.correct;
     result.questions.push(q);
     // console.log('in store question now: ', q);
     userdb.addQuestion(
                user,
                collection,
                question.id,
                correct,
                -1,
                Date(),
                result.hash,
                reduceCounter);
}

var getQuestion = function() {
    // console.log('in getQuestion', set, set[0]);
    var number = set[0];
    quizdb.getQuestion(collection, number, function(err,question) {
        if (err) {
            console.log('Could not get question');
            return;
        } else {
            storeQuestion(question);
        }
    });
}

var addQuestions = function(err, count) {
  if (currentRes==null) {
    console.log('respponse already send');
    return;
  } else {
      result.count  = count;
      set = randset(1, result.count, result.numQuestions);
      getQuestion();
  }
}

module.exports = router;
