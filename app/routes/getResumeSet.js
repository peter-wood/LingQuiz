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
var set = [];
var answers = [];


router.get('/', function(req, res) {
    console.log('getResumeSet GET accessed');
    currentRes = res;
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    var authdata = auth.hasPermission(key);
    if (!authdata) {
	console.log('not authorized');
        result = -1;
        currentRes.jsonp(result);
        currentRes = null;
    } else {
      console.log('authorized :-)');
      var data =JSON.parse(req.query.data);
      user = authdata.user;
      cHash = data.cHash;
      result.hash = cHash;
      result.questions = [];
      userdb.getCurrentSet(user, cHash, init)
    }
});

var getData = function() {
      collection = result.collection;
      console.log('getData looking for ', collection);
      var index = -1;
      for (var x = 0; x < config.quizzes.length; ++x) {
          if (config.quizzes[x].quiz === collection) {
              index = x;
              break;
          }
      }
      console.log('got index: ', index);
      result.open = config.quizzes[index].open;
      result.time = config.quizzes[index].time;
      result.numQuestions = config.quizzes[index].numQuestions;
      result.retake = config.quizzes[index].retake;
      result.save = config.quizzes[index].save;
}

var send = function(err, data) {
    if (currentRes === null) {
        console.log('resutlt already sent');
        return;
    }
    for (var x = 0; x < answers.length; ++x) {
	    result.questions[x]['answer'] = answers[x];
    }
    getData();
    currentRes.jsonp(result);
    currentRes = null;
}

var storeQuestion = function(question) {
     var q = {};
     q.question = question['question'];
     q.text = question['text'];
     q.opt1 = question['opt1'];
     q.opt2 = question['opt2'];
     q.opt3 = question['opt3'];
     q.opt4 = question['opt4'];
     q.opt5 = question['opt5'];
     q.id = question['id'];
     q.resource = question['resource'];
     q.correct = false;
     q.answer = 0;
     result.questions.push(q);
     set.splice(set.indexOf(q.id), 1);
     if (set.length > 0) {
	     getQuestion();
     } else {
	     send();
     }
}

var getQuestion = function() {
	var number = set[0];
	quizdb.getQuestion(result.collection, number, function(err, question) {
		if (err) {
			console.log('could not get resume question');
			return;
		} else {
            console.log('got question: ', question);
			storeQuestion(question);
		}
	});
}

var init = function(err, t, stuff) {
    console.log('this is init in ResumeSet');
    if (currentRes===null) { 
	    console.log('result already sent');
	    return;
    } else {
        //console.log('getResumeSet init got: ',err, t, stuff);
        //console.log('t', t.length);
        set = [];
        answers = [];
        var count = 0;
        var f = function(obj) {
            count++;
            console.log('*************** adding question to resume: ', count);
            console.log('ok ', obj);
		    answers.push(obj['answer']);
		    set.push(obj['question']);
		    result.collection = obj['coll'];
            result.hash = obj['setHash'];
	    }
        stuff.map(f);
        console.log('init before calling getQuestion: answers, set, coll: ', answers, set, result.collection);
	    getQuestion();
    }
}


module.exports = router;
