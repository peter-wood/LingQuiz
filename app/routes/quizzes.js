var express = require('express');
var auth = require('../lib/auth.js');
var userdb = require('../lib/v2userdb.js');
var router = express.Router();
var currentRes = null;

router.get('/', function(req, res) {
    console.log('quizzes GET accessed');
    currentRes = res;
    var key = req.cookies['myLingKey'];
    console.log('key: ' + key);
    auth.printAuth();
    var authdata = auth.hasPermission(key);
    if (!authdata) {
	console.log('not authorized');
        sendResult({'result': -1});
    } else {
      console.log('authorized :-)');
      sendList(authdata.user);
    }
});


var sendResult = function(result) {
  if (currentRes==null) {
    console.log('respponse already send');
    return;
  }
  console.log('sending result: %s', JSON.stringify(result));
  currentRes.jsonp(result);
  currentRes = null;
}


var sendList = function(user) {
  if (currentRes==null) {
    console.log('respponse already send');
    return;
  }
  userdb.getQuizzes(user, sendResult);
  //result = {'result': userdb.getQuizzes(user, sendResult)};
}
module.exports = router;
