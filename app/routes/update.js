var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var quizdb = require('../lib/v2quizdb.js');
var userdb = require('../lib/v2userdb.js');
var router = express.Router();
var currentRes = null;
var id = null;
var user  = null;

router.get('/', function(req, res) {
    console.log('update GET accessed');
    currentRes = res;
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    var authdata = auth.hasPermission(key);
    if (!authdata) {
	console.log('not authorized');
        send(-1, 'error authorizing');
    } else {
      console.log('authorized :-)');
      var data =JSON.parse(req.query.data);
      user = authdata.user;
      var collection = data.quiz;
      id = data.id;
      var hash = data.hash;
      var answer = data.answer;
      console.log('update params', user, collection, id, hash, answer);
      userdb.modQuestion(user, collection, id, hash, answer, send);
    }
});

var send = function(err, res) {
    if (currentRes === null) {
        console.log('already send result');
        return;
    }
    userdb.dumpData(user, function() {
        console.log ('*********************** send called with', err, res);
        currentRes.jsonp({'data': res});
        currentRes = null;
    });
}

module.exports = router;
