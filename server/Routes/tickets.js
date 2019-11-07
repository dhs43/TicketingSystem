const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getConnection = require('../db.js');

router.use(bodyParser.json());

// ROUTES

router.get('/all', (req, res, next) => {
    var statement = "SELECT * FROM ticket;"

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

router.get('/:id', (req, res, next) => {
    var ticket_id = req.params.id;
    var statement = "SELECT * FROM ticket WHERE ticket_ID = " + ticket_id + ";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send(result[0]);
            }
        });
        connection.release();
    });
});

router.post('/assign/:ticket_id/:technician_id', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;
    var technician_ID = req.params.technician_id;

    var statement = "UPDATE ticket \
                     SET assigned_technician_ID = \"" + technician_ID + "\" \
                     WHERE ticket_ID = \"" + ticket_ID + "\";"

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            }else{
                res.send("Ticket assigned successfully");
            }
        });
        connection.release();
    });
});

module.exports = router;