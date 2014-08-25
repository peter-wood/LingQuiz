var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendfile('./webroot/index.html');
});

module.exports = router;
