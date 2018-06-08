const passport = require('passport');

exports.login = (req, res) => {
  passport.authenticate('local')(req, res, () => {
    res.status(200).send('Logged in.');
  })
};

exports.logout = (req, res) => {
  req.logout();
  res.status(200).send('Logged out.');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('You must be logged in.');
};