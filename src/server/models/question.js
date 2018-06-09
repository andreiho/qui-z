const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
mongoose.Promise = global.Promise;

const questionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'A question must have a name.'
  },
  option1: {
    type: String,
    required: 'A question must have a first option.'
  },
  option2: {
    type: String,
    required: 'A question must have a second option.'
  },
  option3: {
    type: String,
    required: 'A question must have a third option.'
  },
  option4: {
    type: String,
    required: 'A question must have a fourth option.'
  },
  correctAnswer: {
    type: Number,
    require: 'A question must have a correct answer',
    // By default exclude this field when doing a .find, to avoid exposing it to the user by mistake
    // We can include it when needed, such as when verifying an answer, using .select('+correctAnswer')
    select: false
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A question must have an author.'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

questionSchema.index({
  name: 'text'
});

questionSchema.plugin(mongodbErrorHandler);

function autopopulate(next) {
  this.populate('author');
  next();
}

questionSchema.pre('find', autopopulate);
questionSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Question', questionSchema);