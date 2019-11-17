const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getConnection = require('../db.js');

router.use(bodyParser.json());

// ROUTES
// Get all tickets
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

// Get my tickets
router.get('/my_tickets/:technician_name', (req, res, next) => {
    var technician_name = req.params.technician_name;
    var statement = "SELECT * FROM ticket WHERE assigned_technician = \"" + technician_name + "\";";

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

// Get unassigned tickets
router.get('/unassigned', (req, res, next) => {
    var statement = "SELECT * FROM ticket WHERE assigned_technician IS NULL;";

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

// Get specific ticket info
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

// Assign a ticket to a technician
router.get('/assign/:ticket_id/:technician_name', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;
    var technician_name = req.params.technician_name;

    var statement = "UPDATE ticket \
                     SET assigned_technician = \"" + technician_name + "\" \
                     WHERE ticket_ID = \"" + ticket_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send("Ticket assigned successfully");
            }
        });
        connection.release();
    });
});

// Delete a ticket
router.get('/delete/:ticket_id', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;

    var deleteCommentsStatement = "DELETE FROM comments \
                                   WHERE ticket_ID = \"" + ticket_ID + "\";";

    var deleteTicketStatement = "DELETE FROM ticket \
                                 WHERE ticket_ID = \"" + ticket_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(deleteCommentsStatement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                connection.query(deleteTicketStatement, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                        return null;
                    } else {
                        res.send("Ticket deleted successfully");
                    }
                });
            }
        });
        connection.release();
    });
});

module.exports = router;