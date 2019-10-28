const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 15;
const AUTH_FAILURE = "auth failure";

router.use(bodyParser.json());

// ENV VARIABLES
if (process.env.NODE_ENV === 'production') {
    dotenv.config({
        path: `${__dirname}/../.env`
    });
    router.use(bodyParser.json());
}

// SQL DATABASE CONNECTION
var mysql_pool = mysql.createPool({
    connectionLimit: 100,
    host: 'database-1.cs4vedk6qhqf.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: process.env.SQL_PASSWORD,
    database: 'ticket_system',
    port: 3306,
    ssl: 'Amazon RDS'
});


// AUTHENTICATION FUNCTIONS
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
        // FORMAT OF HEADER: "Authorization: Bearer <access_token>"
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                console.log(authData); // user email in authData
                next();
            }
        });

    } else {
        res.sendStatus(403); // Forbidden
    }
}


// ROUTES
router.post('/loginUser', (req, res, next) => {
    if (req.body === undefined
        || !req.body.email.trim()
        || !req.body.password.trim()) {
        res.send(AUTH_FAILURE);
        return null;
    }

    var email = req.body.email;
    var password = req.body.password;
    var encrypted = '';

    var statement = "SELECT password FROM technicians where technician_ID = '" + email + "';";

    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.log('Could not connect to DB: ' + err);
        } else {
            connection.query(statement, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.send(AUTH_FAILURE);
                    return null;
                }
                if (result[0] === undefined) {
                    console.log("Email not found in DB");
                    res.send(AUTH_FAILURE);
                    return null;
                }
                encrypted = result[0].password;

                bcrypt.compare(password, encrypted, function (err, bcryptResponse) {
                    if (err) {
                        console.log(err);
                        return null;
                    }
                    if (bcryptResponse) {
                        console.log("Password match");
                        jwt.sign({ email }, process.env.SECRET, { expiresIn: '1 days' }, (err, token) => {
                            if (err) {
                                console.log(err);
                                return null;
                            }
                            res.send(token);
                        });
                    } else {
                        console.log("Incorrect password");
                        res.send(AUTH_FAILURE);
                    }
                })
            });
            connection.release();
        }
    });
});


router.post('/newUser', (req, res, next) => {
    console.log("testing it out");
    var email = req.body.email;
    var password = generateHash(req.body.password);

    var statement = "INSERT INTO technicians (technician_ID, first_name, last_name, is_admin, password) VALUES ('" + email + "', 'Bob', 'Smith', false, '" + password + "');";

    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.log('Could not connect to DB: ' + err);
        } else {
            connection.query(statement, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    return null;
                }
            });
        }
        connection.release();
    });

    res.send("New user created");
});


router.get('/test', verifyToken, (req, res, next) => {
    res.send("This is a test from the server.");
});

module.exports = router;
