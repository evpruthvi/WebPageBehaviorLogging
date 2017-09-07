var express = require('express');
var router = express.Router();
var path = require('path');

router.post('/', function(req, res, next) {
    res.clearCookie('userName');
    res.redirect('/');
});

module.exports = router;