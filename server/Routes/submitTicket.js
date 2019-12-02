const express = require('express');
const router = express.Router();
const getConnection = require('../db.js');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// This route is separate from other ticket-related routes
// because users can access it without authentication.

router.use(bodyParser.json());

// Confirmation email configuration
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hsuhelpdeskproject@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});



// Submit ticket route
router.post('/', (req, res, next) => {

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phone = req.body.phone;
    var location = req.body.location;
    var subject = req.body.subject;
    var description = req.body.description;
    var severity = req.body.severity;

    date = new Date();

    var ticketStatement = "INSERT INTO ticket \
                    (subject, customer_ID, customer_name, description, status, time_spent, time_submitted, location, severity, phone_number) \
                    VALUES \
                    (\"" + subject + "\", \"" + email + "\", \"" + firstname + " " + lastname + "\", \"" + description + "\", \"open\", 0, \"" + date.getTime() / 1000 + "\", \"" + location + "\", \"" + severity + "\", \"" + phone + "\");";

    getConnection(function (err, ticketConnection) {
        ticketConnection.query(ticketStatement, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Ticket creation failed");
                return null;
            } else {
                // Email user confirmation
                var emailStatement = "SELECT ticket_ID FROM ticket WHERE customer_ID = \"" + email + "\" ORDER BY time_submitted DESC;";
                getConnection(function (err, emailConnection) {
                    emailConnection.query(emailStatement, function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            var mailOptions = {
                                from: 'hsuhelpdeskproject@gmail.com',
                                to: email,
                                subject: 'ResNet - Ticket #' + result[0].ticket_ID,
                                text: 'We have received your ticket and will respond ASAP! \n\nYour problem description:\n' + description + '\n\nReply to this email if you need to update your ticket.\nResNet Helpdesk - Ticket #' + result[0].ticket_ID
                            };
    
                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Confirmation email sent");
                                }
                            });
                        }
                    });
                    emailConnection.release();
                });
                getConnection(function (err, activityConnection) {
                    // Insert initial activity values for each technician

                    var statement = "SELECT * FROM technicians;"

                    getConnection(function (err, ticketsConnection) {
                        ticketsConnection.query(statement, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send(err);
                                return null;
                            } else {
                                
                                var activityStatement = "INSERT into activity \
                                                        (technician_ID, ticket_ID, last_seen_comment_ID) \
                                                        VALUES ();";



                                res.send("Ticket created successfully");
                            }
                        });
                        ticketsConnection.release();
                    });
                });
            }
        });
        ticketConnection.release();
    });
});

module.exports = router;