const mongoose = require('mongoose');
const { promisify } = require('es6-promisify');

const User = mongoose.model('User');

exports.register = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = new User({ email, name });
  const register = promisify(User.register.bind(User));
  await register(user, password);
  res.json({ email, name });
};