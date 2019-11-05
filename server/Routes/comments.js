const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getConnection = require('../db.js');
const nodemailer = require('nodemailer');

router.use(bodyParser.json());

// Email configuration
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hsuhelpdeskproject@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

// ROUTES

// Get all comments from a ticket
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

// Create a new comment on a ticket
router.post('/new/:ticket_id', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;
    var author_ID = req.body.author_id;
    var text = req.body.text;

    date = new Date();
    var commentStatement = "INSERT INTO comments \
                     (ticket_ID, author_ID, creation_date, text) \
                     VALUES \
                     (\"" + ticket_ID + "\", \"" + author_ID + "\", \"" + date.getTime() / 1000 + "\", \"" + text + "\");"

    var customerStatement = "SELECT customer_ID FROM ticket WHERE ticket_ID = " + ticket_ID + ";";

    getConnection(function (err, customerConnection) {
        customerConnection.query(customerStatement, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Comment creation failed");
                return null;
            } else {
                email = result[0].customer_ID,

                    getConnection(function (err, commentConnection) {
                        commentConnection.query(commentStatement, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send("Comment creation failed");
                                return null;
                            } else {
                                var mailOptions = {
                                    from: 'hsuhelpdeskproject@gmail.com',
                                    to: email,
                                    subject: 'Re: ResNet - Ticket #' + ticket_ID,
                                    text: text
                                };

                                transporter.sendMail(mailOptions, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("New technician comment email sent to customer");
                                    }
                                });
                            }
                        });
                        commentConnection.release();
                    });
                res.send("Comment created successfully");
            }
        });
        customerConnection.release();
    });
});

// Edit an existing comment
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
