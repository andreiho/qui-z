const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'A quiz must have a name.'
  },
  slug: String,
  questions: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Question'
    }],
    validate: {
      validator: v => v.length >= 1,
      message: 'A quiz must have at least one question.'
    },
    required: 'A quiz must have at least one question.'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A quiz must have an author.'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

quizSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const quizzesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (quizzesWithSlug.length) {
    this.slug = `${this.slug}-${quizzesWithSlug.length + 1}`;
  }

  next();
});

quizSchema.index({
  name: 'text'
});

quizSchema.plugin(mongodbErrorHandler);

function autopopulate(next) {
  this.populate('author');
  this.populate('questions');
  next();
}

quizSchema.pre('find', autopopulate);
quizSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Quiz', quizSchema);