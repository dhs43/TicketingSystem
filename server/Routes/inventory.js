const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getConnection = require('../db.js');

router.use(bodyParser.json());

// Get all devices
router.get('/all_devices', (req, res, next) => {
    var statement = "SELECT * FROM devices;";

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

// Get single device by ID
router.get('/get_device/:device_id', (req, res, next) => {
    var device_ID = req.params.device_id;

    var statement = "SELECT * FROM devices WHERE device_ID = \"" + device_ID + "\";";

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

// Create a new device
router.post('/new_device', (req, res, next) => {
    var title = req.body.title;
    var serial_number = req.body.serial_number;
    var model = req.body.model;
    var location = req.body.location;
    var status = req.body.status;

    var statement = "INSERT INTO devices \
                     (title, serial_number, model, location, status) \
                     VALUES \
                     (\"" + title + "\", \"" + serial_number + "\", \"" + model + "\", \"" + location + "\", \"" + status + "\");";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send("Device saved successfully");
            }
        });
        connection.release();
    });
});

// Update existing device by ID
router.post('/update_device/:device_id', (req, res, next) => {
    var device_ID = req.params.device_id;
    var title = req.body.title;
    var serial_number = req.body.serial_number;
    var model = req.body.model;
    var location = req.body.location;
    var status = req.body.status;

    var statement = "UPDATE devices \
                     SET title = \"" + title + "\", serial_number = \"" + serial_number + "\", model = \"" + model + "\", location = \"" + location + "\", status = \"" + status + "\" \
                     WHERE device_ID = \"" + device_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send("Device updated successfully");
            }
        });
        connection.release();
    });
});

// Delete a device by ID
router.get('/delete/:device_id', (req, res, next) => {
    var device_ID = req.params.device_id;

    var statement = "REMOVE FROM devices WHERE device_ID = \"" + device_ID + "\";";

    getConnection(function (err, connection) {
        connection.query(statement, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return null;
            } else {
                res.send("Device deleted successfully");
            }
        });
        connection.release();
    });
});

module.exports = router;