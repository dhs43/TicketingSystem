const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 8000;

const userRoutes = require('./Routes/users');

app.use('/users', userRoutes);

app.post('/api/posts', verifyToken, (req, res) => {

	res.json({
		message: 'Post created'
	});
});

app.post('/api/login', (req, res) => {
	// Go through authentication

	const user = {
		id: 1,
		username: 'brad',
		email: 'brad@gmail.com'
	}

	jwt.sign({ email }, process.env.SECRET, { expiresIn: '1 days' }, (err, token) => {
		if (err) { console.log(err); }
		res.json({ token });
	});
});

function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		// Get token from split array
		// FORMAT OF TOKEN: "Authorization: Bearer <access_token>""
		const bearerToken = bearer[1];
		req.token = bearerToken;

		jwt.verify(req.token, process.env.SECRET, (err, authData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				console.log(authData);
				next();
			}
		});

	} else {
		// Forbidden
		res.sendStatus(403);
	}
}



if (process.env.NODE_ENV === 'production') {
	console.log("In build mode");

	// Express first tries to serve production assets
	app.use(express.static(path.resolve(__dirname + '/../client/build/')));

	// Express will serve index.html if it doesn't recognize route
	app.get('*', (req, res) => {
		console.log("Got here");
		console.log(req.protocol + "://" + req.get('host') + req.originalUrl);
		res.sendFile(path.resolve("server/client", "build", "index.html"));
	});
}

app.listen(PORT);
console.log("Server running on port " + PORT);
