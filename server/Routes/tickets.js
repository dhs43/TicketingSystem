const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getConnection = require('../db.js');

router.use(bodyParser.json());

date = new Date();

// ROUTES

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
    });
});

module.exports = router;