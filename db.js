var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'mysqlinstance.cqc6lfh7kjsx.us-east-2.rds.amazonaws.com',
    user     : 'evpruthvi',
    password : 'mypassword',
    database : 'test'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;