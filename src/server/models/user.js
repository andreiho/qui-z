const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid e-mail address.'],
    required: 'Please supply an e-mail address.'
  },
  name: {
    type: String,
    required: 'Please supply a name.',
    trim: true
  }
});

userSchema.virtual('gravatar').get(() => {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);