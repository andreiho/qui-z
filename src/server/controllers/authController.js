const passport = require('passport');
const { pick, extend } = require('lodash');
const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Incorrect e-mail or password.'});

    const picture = user.gravatar;

    req.login(user)
      .then(() => {
        res.status(200).json({
          sessionId: req.sessionID,
          user: extend({ picture }, pick(user, [ '_id', 'name', 'email' ]))
        });
      })
  })(req, res, next)
};

exports.logout = (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'You have been logged out.' });
}

exports.isLoggedIn = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' || req.isAuthenticated()) {
    return next();
  }
  next({ status: 401, message: 'You must be logged to perform that action.' });
};