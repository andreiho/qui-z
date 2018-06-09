const { promisify } = require('es6-promisify');
const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.register = async (req, res, next) => {
  const { email, name, password } = req.body;

  // Check whether a user with the same e-mail already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next({ status: 404, message: 'A user with that e-mail already exists.' });
  }

  // If not, create the new user
  const user = new User({ email, name });
  const register = promisify(User.register.bind(User));
  await register(user, password);

  res.json({ email, name, picture: user.gravatar });
};