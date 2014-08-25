var express = require('express');
var auth = require('../lib/auth.js');
var router = express.Router();

router.post('/', function(req, res) {
        console.log('auth accessed');
		var data  = '';
		var flag = false;
		req.on('data', function (d) {
			data += d;
			if (data.length > 255) {
				console.log('too much stuff coming in');
				flag = true;
				res.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
				res.end('<!doctype html><html><body>Sorry</body></html>');
				return;
			}
                 });
			
                 req.on('end', function() {
			if (!flag) { // data seems valid
				var nsid = JSON.parse(data)['nsid'];
				var snum = JSON.parse(data)['pass'];
                console.log('auth got: ' + nsid + ', ' + snum);
				auth.addKey(nsid, snum, function(key) {
                    if (key==='invalid') {			// got no key :-(
                        res.setHeader('Pragma', 'invalid');
                        console.log('User not found in db');
                    } else { 			// got valid key :-)
                        res.setHeader('Pragma', key);
                        console.log('User found in db');
                    }
                    console.log('returning authkey: ' + key);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end('<!doctype html><html><body>Thanks</body></html>');
                });
            };
		 });
});

module.exports = router;
