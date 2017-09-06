var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');
var fs = require('fs');
var path = require('path');


router.post('/', function(req, res, next) {
    var post = req.body;

    db.query('create table if not exists user_'+ post.user_name +' (action VARCHAR(30), action_time VARCHAR(100));', function(err, result) {
        if (err)
            throw err;
        else{
            db.query('INSERT INTO user_'+ post.user_name +' (action, action_time) VALUES (\''+ post.action +'\', \''+ post.action_time +'\');', function(err, result) {
                if (err)
                    throw err;
                else
                    console.log("Insert Successful");
                    res.end('{"success" : "Updated Successfully", "status" : 200}');
            });
        }
    });
});

module.exports = router;