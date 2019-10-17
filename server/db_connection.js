var mysql = require('mysql');
var fs = require('fs');

var statement = "SELECT * from test2;";

var connection = mysql.createConnection({
    host: 'database-1.cs4vedk6qhqf.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'scott=dum',
    database: 'ticket_system',
    ssl: 'Amazon RDS'
});


console.log(connection.state);

connection.connect(function(err) {
    if (err) console.log(err);
    console.log("Connected to database");
    connection.query(statement, function(err, result, fields) {
        if (err) console.log(err);
        console.log("Result: " + result[0].name);
    });
});
