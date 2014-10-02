var express = require('express');
var fs = require('fs');
var auth = require('../lib/auth.js');
var userdb = require('../lib/v2userdb.js');
var router = express.Router();
var currentRes = null;
var user  = null;

router.get('/', function(req, res) {
    console.log('modStatus GET accessed');
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
      var toMod = data.toMod;
      console.log('update status', user, index, toMod);
      userdb.modStatus(user, index, toMod, send);
    }
});

var send = function(err, res) {
    if (currentRes === null) {
        console.log('already send result');
        return;
    }
    console.log('modStatus is sending ', {'data': res});
    currentRes.jsonp({'data': res});
    currentRes = null;
}

module.exports = router;
