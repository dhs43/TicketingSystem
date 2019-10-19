const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/api/test', function (req, res) {
	return res.send('Software Engineering - HSU Helpdesk');
});

if (process.env.NODE_ENV === 'production') {
	console.log("In build mode");

	// Express first tries to serve production assets
	app.use(express.static(path.resolve('server/client/build/')));

	// Express will serve index.html if it doesn't recognize route
	app.get('*', (req, res) => {
		console.log("Got here");
		console.log(req.protocol + "://" + req.get('host') + req.originalUrl);
		res.sendFile(path.resolve("server/client", "build", "index.html"));
	});
}


app.listen(process.env.PORT || 8000);
console.log("Server running on port " + PORT);
