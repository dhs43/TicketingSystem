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
};

validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};


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

    // Check if user an ACTIVE technician account exists
    var activeUserStatement = "SELECT active_user FROM technicians where technician_ID = '" + email + "';";

    getConnection(function (err, activeUserConnection) {
        activeUserConnection.query(activeUserStatement, function (err, result, fields) {
            if (result[0] === undefined) {
                // Check if account exists
                console.log("Email not found in DB");
                res.send(AUTH_FAILURE);
                return null;
            } else if (result[0].active_user === 0) {
                // Check if account is active
                console.log("Technician account was deactivated");
                res.send(AUTH_FAILURE);
                return null;
            } else {
                // Check password
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
            }
        });
        activeUserConnection.release();
    });
});


router.post('/newUser', (req, res, next) => {
    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var is_admin = req.body.is_admin;
    var password = generateHash(req.body.password);

    var statement = "INSERT INTO technicians (technician_ID, first_name, last_name, is_admin, password, active_user) VALUES ('" + email + "', '" + first_name + "', '" + last_name + "', " + is_admin + ", '" + password + "', 1);";

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

//update technicians
router.post('/updateUser', (req, res, next) => {

    var active_user = req.body.active_user;
    var technician_ID = req.body.technician_ID;

    var statement = "UPDATE technicians SET active_user=\"" + active_user + "\" WHERE technician_ID = \"" + technician_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result, fields) {
            if (err) {
                console.log(err);
                return null;
            }
        });
        connection.release();
    });
    console.log("User updated");
    res.send("User updated");
});


// Get user details
router.get('/getUser/:user_id', (req, res, next) => {
    var user_ID = req.params.user_id;

    // First look for matching technician
    var technicianStatement = "SELECT * FROM technicians WHERE technician_ID = \"" + user_ID + "\";";

    getConnection(function (err, technicianConnection) {
        technicianConnection.query(technicianStatement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                if (result[0] !== undefined) {
                    // Found a technician matching given ID
                    res.send(result[0]);
                } else {
                    res.send("No matching user found");
                }
            }
        });
        technicianConnection.release();
    });
});

router.get('/all_technicians', (req, res, next) => {
    var statement = "SELECT * FROM technicians;";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send(result);
            }
        });
        connection.release();
    });
});



module.exports = router;