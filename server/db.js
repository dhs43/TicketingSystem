const mysql = require('mysql');

// ENV VARIABLES
if (process.env.NODE_ENV === 'production') {
    dotenv.config({
        path: `${__dirname}/../.env`
    });
    router.use(bodyParser.json());
}

// SQL DATABASE CONNECTION
var mysql_pool = mysql.createPool({
    connectionLimit: 100,
    host: 'database-1.cs4vedk6qhqf.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: process.env.SQL_PASSWORD,
    database: 'ticket_system',
    port: 3306,
    ssl: 'Amazon RDS'
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