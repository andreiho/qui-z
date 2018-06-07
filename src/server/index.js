const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// Import environmental variables from our variables.env file
require('dotenv').config({ path: path.join(__dirname, 'variables.env') });

// Connect to our database and handle any bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Serve the static client app
// app.use(express.static(path.join(__dirname, 'dist')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle our API routes
app.use('/', routes);

// Development error handler
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

// Production error handler
app.use(errorHandlers.productionErrors);

// Start our app
app.set('port', process.env.API_PORT || 3001);
const server = app.listen(app.get('port'), () => {
  console.log(`Server running → PORT ${server.address().port}`);
});

module.exports = app;
