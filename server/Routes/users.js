const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 16;

// SQL Database
var connection = mysql.createConnection({
    host: 'database-1.cs4vedk6qhqf.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'scott=dum',
    database: 'ticket_system',
    ssl: 'Amazon RDS'
});

router.get('/test', (req, res, next) => {
    res.send("This is a test from the server.");
});

router.post('/newUser', (req, res, next) => {
    //const { email, password } = req.body;
    //const user = new User({ email, password });

    var statement = "SELECT * from test2;";

    connection.connect(function (err) {
        if (err) console.log(err);
        console.log("Connected to database");
        connection.query(statement, function (err, result, fields) {
            if (err) console.log(err);
            console.log("result: " + result[0].name);
        });
    });

    res.send("New user created");
});

module.exports = router;