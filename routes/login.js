var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('fs');
var path = require('path');

router.post('/historyData', function (req,res,next) {
    db.query('SELECT * FROM user_info WHERE user_name = \'' + req.cookies.userName + '\'', function (err, result) {
        if (err)
            throw err;
        else {
            //var list = [];
            var date = new Date();
            var dateStr = date.toString();
            if(result[0].login_time == ''){
                db.query('UPDATE user_info SET login_time = \''+ dateStr +'\' WHERE user_name = \''+ req.cookies.userName +'\';', function (err, result) {
                    //list.push(dateStr);
                    res.send(dateStr);
                });
            }
            else{
                var login_times = result[0].login_time + '|' + dateStr;
                db.query('UPDATE user_info SET login_time = \''+ login_times +'\' WHERE user_name = \''+ req.cookies.userName +'\';', function (err, result) {
                    if (err)
                        throw err;
                    else{
                        //list = login_times.split('|');
                        res.send(login_times);
                    }
                });
            }
        }
    });
});

router.post('/getInteractionsFromDB', function (req,res,next) {
    db.query('select * from user_' + req.cookies.userName+'', function (err,result) {
        if (err)
            throw err;
        else {
            var actionStr = "";
            for(var item in result){
                actionStr = actionStr + result[item].action + " on " + result[item].action_time + " for question "+ result[item].additional_info + "\n \n";
            }
            res.send(actionStr);
        }
    });
});

router.post('/', function(req, res, next) {
    var post = req.body;

    db.query('create table if not exists user_info (user_name VARCHAR(16), password BLOB, login_time VARCHAR(10000), PRIMARY KEY (user_name));', function(err, result) {
        if (err)
            throw err;
        else{
            db.query('create table if not exists user_'+ post.user +' (action VARCHAR(30), action_time VARCHAR(100), additional_info VARCHAR(150));');
            db.query('select * from user_info where user_name=\'' + post.user + '\' and password=AES_ENCRYPT(\'' + post.password + '\',\'secretkey\')', function(err, result) {
                if (err)
                    throw err;
                else
                if(result.length > 0){
                    var userProfileFile = path.join(__dirname, '..', 'public', 'userProfile.html');
                    var data = fs.readFileSync(userProfileFile, 'utf8');
                    res.cookie('userName',post.user,{httpOnly: false });
                    // res.redirect(userProfileFile);
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
                }
            });
        }
    });
});
module.exports = router;