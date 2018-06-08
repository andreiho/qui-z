const config = require('config');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
require('./handlers/passport');

const routes = require('./routes/index');
const errorHandlers = require('./handlers/error');
const app = express();

// Serve the static client app
app.use(express.static('dist'));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions allow us to store data on visitors from request to request
app.use(session({
  secret: config.get('auth.secret'),
  key: config.get('auth.key'),
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// Handle our API routes
app.use('/', routes);

// Development error handler
if (app.get('env') !== 'production') {
  app.use(errorHandlers.developmentErrors);
}

// Production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
