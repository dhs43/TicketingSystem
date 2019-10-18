const express = require('express');
const app = express();
const PORT = 8000;

app.get('/test', function (req, res) {
	return res.send('Software Engineering - HSU Helpdesk');
});

app.listen(process.env.PORT || 8000);
console.log("Server running on port " + PORT);