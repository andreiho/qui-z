const config = require('config');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { promisify } = require('es6-promisify');
const passport = require('passport');
const path = require('path');
require('./handlers/passport');

const routes = require('./routes/index');
const errorHandlers = require('./handlers/error');

const app = express();

// Production settings
if (process.env.NODE_ENV === 'production') {
  // Serve the static React app
  app.use(express.static(path.join(__dirname, '../../dist')));

  // Make sure all paths, except the API ones redirect to the index page
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Populates req.cookies with any cookies that came along with the request
app.use(cookieParser(config.get('auth.secret')));

// Sessions allow us to store data on visitors from request to request
app.use(session({
  name: config.get('auth.key'),
  secret: config.get('auth.secret'),
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// Promisify some callback based APIs
app.use((req, res, next) => {
  req.login = req.logIn = promisify(req.login, req);
  next();
});

// Handle our API routes
app.use('/api', routes);

// Development error handler
if (app.get('env') !== 'production') {
  app.use(errorHandlers.developmentErrors);
}

// Production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
