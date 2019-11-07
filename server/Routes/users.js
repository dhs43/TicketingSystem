const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 15;
const AUTH_FAILURE = "auth failure";
const getConnection = require('../db.js');

router.use(bodyParser.json());

// AUTHENTICATION FUNCTIONS
generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
}

validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
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

    getConnection(function (err, connection) {
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
    });
});


router.post('/newUser', (req, res, next) => {
    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var is_admin = req.body.is_admin;
    var password = generateHash(req.body.password);

    var statement = "INSERT INTO technicians (technician_ID, first_name, last_name, is_admin, password) VALUES ('" + email + "', '" + first_name + "', '" + last_name + "', " + is_admin + ", '" + password + "');";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result, fields) {
            if (err) {
                console.log(err);
                return null;
            }
        });
        connection.release();
    });
    console.log("New user created");
    res.send("New user created");
});


// Get technician details
router.get('/technician/:technician_id', (req, res, next) => {
    var technician_ID = req.params.technician_id;

    var statement = "SELECT * FROM technicians WHERE technician_ID = \"" + technician_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            }else{
                res.send(result[0]);
            }
        });
    });
});


// Get customer details
router.get('/customer/:customer_id', (req, res, next) => {
    var customer_ID = req.params.customer_id;

    var statement = "SELECT * FROM customer WHERE customer_ID = \"" + customer_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            }else{
                res.send(result[0]);
            }
        });
    });
});


module.exports = router;