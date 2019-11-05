const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const imapStuff = require('./email');
const PORT = process.env.PORT || 8000;

// VERIFY LOGIN
var verifyToken = function (req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		// Get token from split array
		// FORMAT OF HEADER: "Authorization: Bearer <access_token>"
		const bearerToken = bearer[1];
		req.token = bearerToken;

		jwt.verify(req.token, process.env.SECRET, (err, authData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				console.log(authData); // user email in authData
				next();
			}
		});

	} else {
		res.sendStatus(403); // Forbidden
	}
}

const userRoutes = require('./Routes/users');
const submitTicketRoute = require('./Routes/submitTicket');
const ticketRoutes = require('./Routes/tickets');
const commentRoutes = require('./Routes/comments');

// ROUTES
app.use('/users', userRoutes);
app.use('/submitTicket', submitTicketRoute);
app.use('/tickets', verifyToken, ticketRoutes);
app.use('/comments', verifyToken, commentRoutes);


// ROUTE TO REACT CLIENT FILES
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
