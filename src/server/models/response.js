const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
mongoose.Promise = global.Promise;

const responseSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: 'A response must reference a quiz.'
  },
  answers: [{
    answer: Number,
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
    }
  }],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A response must have an author.'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

responseSchema.plugin(mongodbErrorHandler);

function autopopulate(next) {
  this.populate('author');
  this.populate('answers.question', 'name +correctAnswer');
  next();
}

responseSchema.pre('find', autopopulate);
responseSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Response', responseSchema);