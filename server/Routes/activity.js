const express = require('express');
const router = express.Router();
const getConnection = require('../db.js');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/mark_as_read/:ticket_id/:technician_id', (req, res, next) => {
    var ticket_ID = req.params.ticket_id;
    var technician_ID = req.params.technician_id;
    var last_seen_comment_ID = undefined;

    var max_comment_statement = "SELECT MAX(comment_ID) comment_ID \
                             FROM comments \
                             WHERE ticket_ID = \"" + ticket_ID + "\";";

    getConnection(function (err, max_comment_connection) {
        max_comment_connection.query(max_comment_statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Max comment error");
                return null;
            } else {
                console.log(result[0].comment_ID);
                last_seen_comment_ID = result[0].comment_ID;

                if (last_seen_comment_ID === undefined) {
                    console.log("No activity entry for this user/ticket");
                    res.send("No activity entry for this user/ticket")
                    return null;
                } else {

                    var update_statement = "UPDATE activity \
                                            SET last_seen_comment_ID = \"" + last_seen_comment_ID + "\" \
                                            WHERE ticket_ID = \"" + ticket_ID + "\" \
                                            AND technician_ID =  \"" + technician_ID + "\";";

                    getConnection(function (err, update_connection) {
                        update_connection.query(update_statement, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send("Update last_seen_comment_ID error");
                                return null;
                            } else if (result.changedRows === 0) {
                                console.log("Updated zero activity rows");
                                res.send("Updated zero activity rows");
                            } else {
                                console.log("Sucessfully updated last_seen_comment_ID");
                                res.send("Sucessfully updated last_seen_comment_ID");
                            }
                        });
                        update_connection.release();
                    });
                }
            }
        });
        max_comment_connection.release();
    });
});

router.get('/get_activity/:technician_id', (req, res, next) => {
    var technician_ID = req.params.technician_id;
    var updates = undefined;

    var statement = 'SELECT ticket_ID, MAX(comment_ID) comment_ID\
                     FROM comments \
                     GROUP BY ticket_ID;';

    getConnection(function (err, connection) {
        connection.query(statement, function(err, result) {
            if (err) {
                console.log(err);
                res.send("Max comment error");
                return null;
            } else {
                for (var i = 0; i < result.length; i++) {
                    console.log(result[i]);
                }
                res.send(result);
            }
        });
        connection.release();
    });

    // 1. Check which tickets have out-of-date last-read comments
            // A. Fetch last comment_ID from all tickets
            // B. Check if activity table shows technician has read it
                    // 1. If not, add it to an activity list.
                    // 2. If read, skip it
    // 2. Fetch the most recent comments
    // 3. Display those comments in the activity.
    // 4. If the user clicks on one, it should load that ticket, which will then mark it as read.
});

module.exports = router;