var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var router = express.Router();
var currentRes = null;
var result = null;
var myPath = null;
var requestType = { '/book_res': ['book', /\.pdf$/],
	            '/handouts_res': ['handouts', /\.pdf$/],
		    '/slides_res': ['slides', /\.html$/]
};
var thisRequest = null;


router.get('/', function(req, res) {
    console.log('docs GET accessed');
    myPath = req.app.locals.myPath;
    console.log ('path: %s', myPath);
    thisRequest = requestType[myPath];
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
      fs.readdir(config[thisRequest[0]], sendDir);
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
      // strip file suffix 
      var returnvalue = [];
      var reg = thisRequest[1];
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
