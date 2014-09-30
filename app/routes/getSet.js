var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var config = require('../lib/config.js');
var userdb = require('../lib/v2userdb.js');
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
        send(0, result);
    } else {
      console.log('authorized :-)');
      var data =JSON.parse(req.query.data);
      user = authdata.user;
      var index = data.index;
      userdb.getSet(user,index, send);
    }
});

var send = function(err, data) {
    if (currentRes === null) {
        console.log('resutlt already sent');
        return;
    }
    console.log('sending result: %s', JSON.stringify(data));
    currentRes.jsonp(data);
    currentRes = null;
}



module.exports = router;
