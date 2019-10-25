const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 16;

generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
}

validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
}

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        // Get token from split array
        // FORMAT OF TOKEN: "Authorization: Bearer <access_token>""
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                console.log(authData);
                next();
            }
        });

    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

// SQL Database
var connection = mysql.createConnection({
    host: 'database-1.cs4vedk6qhqf.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: process.env.SQL_PASSWORD,
    database: 'ticket_system',
    ssl: 'Amazon RDS'
});

router.use(bodyParser.json());

router.get('/test', verifyToken, (req, res, next) => {

    res.send("This is a test from the server.");
});

router.post('/loginUser', (req, res, next) => {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var encrypted = '';

    var statement = "SELECT password FROM technicians where technician_ID = '" + email + "';";

    connection.connect(function (err) {
        if (err) console.log(err);
        console.log("Connected to database");
        connection.query(statement, function (err, result, fields) {
            if (err) console.log(err);
            encrypted = result[0].password;

            console.log("Data " + password + " Hash: " + encrypted);

            bcrypt.compare(password, encrypted, function (err, res) {
                if (err) console.log(err);
                if (res) {
                    console.log("Password match");
                    jwt.sign({ email }, process.env.SECRET, { expiresIn: '1 days' }, (err, token) => {
                        if (err) { console.log(err); }
                        console.log(token);
                        res.json({ token });
                    });
                } else {
                    console.log("Incorrect password");
                    res.sendStatus(403);
                }
            })
        });
    });



});

router.post('/newUser', (req, res, next) => {
    console.log(req.body);
    var email = req.body.email;
    var password = generateHash(req.body.password);

    console.log(password);

    var statement = "INSERT INTO technicians (technician_ID, first_name, last_name, is_admin, password) VALUES ('" + email + "', 'Bob', 'Smith', false, '" + password + "');";

    connection.connect(function (err) {
        if (err) console.log(err);
        console.log("Connected to database");
        connection.query(statement, function (err, result, fields) {
            if (err) console.log(err);
            console.log("result: " + result[0].password);
        });
    });

    res.send("New user created");
});

module.exports = router;