var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

// router.post('/historyTemplate.htm', function(req, res, next) {
//     var historyTemplate = path.join(__dirname, '..', 'public','templates','historyItem.htm');
//     var data = fs.readFileSync(historyTemplate);
//     res.send(data);
// });
router.post('/historyData', function (req,res,next) {
    db.query('SELECT * FROM user_info WHERE user_name = \'' + req.cookies.userName + '\'', function (err, result) {
        if (err)
            throw err;
        else {
            var list = [];
            var date = new Date();
            var dateStr = date.toString();
            if(result[0].login_time == ''){
                db.query('UPDATE user_info SET login_time = \''+ dateStr +'\' WHERE user_name = \''+ req.cookies.userName +'\';', function (err, result) {
                    list.push(dateStr);
                    res.send(list);
                });
            }
            else{
                var login_times = result[0].login_time + '|' + dateStr;
                db.query('UPDATE user_info SET login_time = \''+ login_times +'\' WHERE user_name = \''+ req.cookies.userName +'\';', function (err, result) {
                    if (err)
                        throw err;
                    else{
                        list = login_times.split('|');
                        res.send(list);
                    }
                });
            }
        }
    });
    // db.query('CREATE TABLE IF NOT EXISTS user_'+ req.cookies.userName +'(login_time INT(11))', function(err, result) {
    //     if (err)
    //         throw err;
    //     else {
    //         currentTime = moment().unix();
    //         db.query('INSERT INTO `user_' + req.cookies.userName + '`(`login_time`) VALUES (' + currentTime + ')', function (err, result) {
    //             if (err)
    //                 throw err;
    //             else
    //                 db.query('select * from user_' + req.cookies.userName, function (err, result) {
    //                     var list = [];
    //                     for(var item in result){
    //                         var time = moment.unix(result[item].login_time).format("dddd, MMMM Do YYYY, h:mm:ss a");
    //                         list.push(time);
    //                     }
    //                     res.send(list);
    //                 });
    //         });
    //     }
    // });
});

router.post('/', function(req, res, next) {
    var post = req.body;

    db.query('create table if not exists user_info (user_name VARCHAR(16), password BLOB, login_time VARCHAR(10000), PRIMARY KEY (user_name));', function(err, result) {
        if (err)
            throw err;
        else{
            db.query('select * from user_info where user_name=\'' + post.user + '\' and password=AES_ENCRYPT(\'' + post.password + '\',\'secretkey\')', function(err, result) {
                if (err)
                    throw err;
                else
                if(result.length > 0){
                    var userProfileFile = path.join(__dirname, '..', 'public', 'userProfile.html');
                    var data = fs.readFileSync(userProfileFile, 'utf8');
                    res.send(data.replace(/user_name/g,post.user));
                }
                else{
                    var userProfileFile = path.join(__dirname, '..', 'public', 'index.html');
                    var data = fs.readFileSync(userProfileFile, 'utf8');
                    res.send(data.replace(/<!--accountDoesNotExistPlaceholder-->/g,'<p style="color: red">Account Does not exist! Please create an account first.</p>'));
                }
            });
        }
    });
});

router.post('/createAccount', function(req, res, next) {
    var post = req.body;
    db.query('create table if not exists user_info (user_name VARCHAR(16), password BLOB, login_time VARCHAR(10000), PRIMARY KEY (user_name));', function(err, result) {
        if (err)
            throw err;
        else{
            db.query('INSERT INTO user_info VALUES (\''+ post.newUser +'\',AES_ENCRYPT(\''+ post.newPassword +'\',\'secretkey\'),\'\');\n', function(err, result) {
                if (err)
                    throw err;
                else{
                    res.redirect('/');
                    // var userProfileFile = path.join(__dirname, '..', 'public', 'index.html');
                    // var data = fs.readFileSync(userProfileFile, 'utf8');
                    // res.send(data.replace(/<!--accountDoesNotExistPlaceholder-->/g,'<p style="color: red">Account created! Please login.</p>'));
                }
            });
        }
    });
});
module.exports = router;