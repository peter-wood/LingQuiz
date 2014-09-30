var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var userdb = require('../lib/v2userdb.js');
var router = express.Router();
var currentRes = null;
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
      var index = data.index;
      var number = data.number;
      var answer = data.answer;
      console.log('update params', user, index, number, answer);
      userdb.modQuestion(user, index, number, answer, send);
    }
});

var send = function(err, res) {
    if (currentRes === null) {
        console.log('already send result');
        return;
    }
    currentRes.jsonp({'data': res});
    currentRes = null;
}

module.exports = router;
