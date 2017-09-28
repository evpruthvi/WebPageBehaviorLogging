var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('fs');
var path = require('path');

router.post('/userWeight', function(req, res, next) {
    var post = req.body;
    db.query('show table status from test', function(err, result) {
        if (err)
            throw err;
        else{
            var total = 0;
            var dict = {};
            for(var i = 0; i < result.length; i++){
                if(result[i].Name != 'user_info'){
                    var name = result[i].Name;
                    dict[name.split("_")[1]] = result[i].Rows;
                    total = total + result[i].Rows;
                }
            }
            var data = [];
            Object.keys(dict).forEach(function (key) {
                dict[key] = dict[key] * 100 / total;
                data.push([key,dict[key]]);
            });
            res.send(data);
        }
    });
});

router.post('/interactionsAverageUser', function(req, res, next) {
    db.query('show table status from test', function(err, result) {
        if (err)
            throw err;
        else {
            var output = [];
            var counts = [];
            var actions = [];
            var query = '';
            var innerQuery = '';
            var numUsers = 0;
            for (var i = 0; i < result.length; i++) {
                if (result[i].Name != 'user_info') {
                    numUsers = numUsers + 1;
                    if (i == result.length - 1) {
                        innerQuery = innerQuery + "SELECT action FROM " + result[i].Name
                    }
                    else {
                        innerQuery = innerQuery + "SELECT action FROM " + result[i].Name + " UNION ALL "
                    }
                }
            }
            query = "select action, COUNT(*) as count from ( " + innerQuery + " ) as temp GROUP BY action ORDER BY action";
            console.log(query);
            db.query(query, function(err, tableresult) {
                if (err)
                    throw err;
                else{
                    counts.push('average');
                    actions.push('x');
                    for(var k = 0; k < tableresult.length; k++){
                        counts.push(tableresult[k].count/numUsers);
                        actions.push(tableresult[k].action);
                    }
                    output.push(actions);
                    output.push(counts);
                    res.send(output);
                }
            });
        }
    });
});


router.post('/interactionCurrentUser', function(req, res, next) {
    db.query('SELECT action, COUNT(*) as count FROM user_' + req.cookies.userName + ' GROUP BY action ORDER BY action', function(err, tableresult) {
        if (err)
            throw err;
        else {
            var tempDict = {'askQuestionClicked':0,'downVoted':0,'postTagClicked':0,'realtedQuestionsClicked':0,'scrolled':0,'starred':0,'submitted':0,'upVoted':0}
            var output = [];
            var counts = [];
            var actions = [];
            counts.push(req.cookies.userName);
            actions.push('x');
            for (var k = 0; k < tableresult.length; k++) {
                tempDict[tableresult[k].action] = tableresult[k].count;
                // counts.push(tableresult[k].count);
                // actions.push(tableresult[k].action);
            }
            Object.keys(tempDict).sort().forEach(function (key) {
                counts.push(tempDict[key]);
                actions.push(key);
            });
            output.push(actions);
            output.push(counts);
            console.log("output:" + output);
            res.send(output);
        }
    });
});

router.post('/interactionsLastMonth', function(req, res, next) {
    db.query('SELECT * FROM user_' + req.cookies.userName + '', function(err, tableresult) {
        if (err)
            throw err;
        else {
            var output = [];
            var dayCounts = [];
            var days = [];
            var dateIndexDict = {};
            for(var i = 0 ; i < 31 ; i++){
                var d = new Date();
                d.setDate(d.getDate() - i);
                dateIndexDict[d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()] = i;
                dayCounts.push(0);
                days.push(d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear());
                //dayCounts.push(0);
            }
            for(var i = 0; i < tableresult.length ; i++ ){
                var c = new Date(tableresult[i].action_time);
           //     console.log(c);
                var formattedDate = c.getMonth()+"-"+c.getDate()+"-"+c.getFullYear();
                var b = new Date();
                b.setDate(b.getDate() - 31);
                if(c > b){
                    var index = dateIndexDict[formattedDate];
                    dayCounts[index] = dayCounts[index] + 1;
                }
            }
            dayCounts.push(req.cookies.userName);
            days.push('x');
            output.push(dayCounts.reverse());
            output.push(days.reverse());
            res.send(output);
        }
    });
});

module.exports = router;