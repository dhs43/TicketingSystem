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

// // For when I mess up the activity table... smh
// router.get('/make/:ticket', (req, res, next) => {
//     var ticket_ID = req.params.ticket;
//     var statement = "SELECT * FROM technicians;";
//     getConnection(function (err, techniciansConnection) {
//         techniciansConnection.query(statement, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 res.send(err);
//                 return null;
//             } else {
//                 getConnection(function (err, activityConnection) {

//                     result.map((value, index) => {
//                         var activityStatement = "INSERT into activity \
//                                                  (technician_ID, ticket_ID, last_seen_comment_ID) \
//                                                  VALUES (\"" + value.technician_ID + "\", " + ticket_ID + ", 0);";

//                         activityConnection.query(activityStatement, function (err, result) {
//                             if (err) {
//                                 console.log(err);
//                                 res.send(err);
//                                 return null;
//                             }
//                         });
//                     });
//                     res.send("Ticket created successfully");
//                 });
//             }
//         });
//         techniciansConnection.release();
//     });
// });

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
    var ticket_ID = null;

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
                ticket_ID = result.insertId;

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

                // Insert initial activity row of this ticket for each technician
                // We initially input the technician_ID and ticket_ID with a 
                // last_seen_comment_ID of NULL. Get_activity in activity.js checks
                // if the last-read comment ID is older than the latest or NULL.
                var statement = "SELECT * FROM technicians;"

                getConnection(function (err, techniciansConnection) {
                    techniciansConnection.query(statement, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                            return null;
                        } else {
                            getConnection(function (err, activityConnection) {

                                result.map((value, index) => {
                                    var activityStatement = "INSERT into activity \
                                                             (technician_ID, ticket_ID) \
                                                             VALUES (\"" + value.technician_ID + "\", " + ticket_ID + ");";

                                    activityConnection.query(activityStatement, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            res.send(err);
                                            return null;
                                        }
                                    });
                                });
                                res.send("Ticket created successfully");
                            });
                        }
                    });
                    techniciansConnection.release();
                });
            }
        });
        ticketConnection.release();
    });
});

module.exports = router;