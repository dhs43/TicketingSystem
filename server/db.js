const dotenv = require('dotenv').config({
    path: __dirname + '/.env'
});
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
router.use(bodyParser.json());

if (dotenv.error) {
    console.log("Error loading .env: " + dotenv.error);
    throw dotenv.error;
}

// SQL DATABASE CONNECTION
var mysql_pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.DB_PASSWORD,
    port: 3306,
    ssl: {
        ca: fs.readFileSync(__dirname + process.env.SQL_SSL)
    }
});

var getConnection = function (callback) {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Could not get DB connection: " + err);
            return callback(err);
        }
        callback(null, connection);
    });
};

module.exports = getConnection;
