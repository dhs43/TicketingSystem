const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getConnection = require('../db.js');

router.use(bodyParser.json());

// ROUTES

router.get('/:ticket_id', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;
    var statement = "SELECT * FROM comments where ticket_ID = " + ticket_ID + ";";

    getConnection(function (err, conenction) {
        conenction.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send(result);
            }
        });
        conenction.release();
    });
});

router.post('/:ticket_id', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;
    var technician_ID = req.body.technician_ID;
    var text = req.body.text;
    date = new Date();
    var statement = "INSERT INTO comments \
                     (ticket_ID, technician_ID, creation_date, text) \
                     VALUES \
                     (\"" + ticket_ID + "\", \"" + technician_ID + "\", \"" + date.getTime() / 1000 + "\", \"" + text + "\");"

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Comment creation failed");
                return null;
            } else {
                res.send("Comment created successfully");
            }
        });
        connection.release();
    });
});

router.post('/edit/:comment_id', (req, res, next) => {
    var comment_ID = req.params.comment_id;
    var text = req.body.text;
    date = new Date();
    var statement = "UPDATE comments \
                     SET last_edited = \"" + date.getTime() / 1000 + "\", text = \"" + text + "\" \
                     WHERE comment_ID = \"" + comment_ID + "\";"

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Comment edit failed");
                return null;
            } else {
                res.send("Comment edited successfully");
            }
        });
        connection.release();
    });
});

module.exports = router;