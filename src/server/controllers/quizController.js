const mongoose = require('mongoose');

const Quiz = mongoose.model('Quiz');
const Question = mongoose.model('Question');

exports.create = async (req, res) => {
  const name = req.body.name;
  const author = req.user._id;

  // Create all the questions and get their ids which will be added to the quiz document
  const questions = req.body.questions.map(question => Object.assign({ author }, question));
  const questionDocs = await Question.insertMany(questions);
  const questionIds = questionDocs.map(question => question._id);

  const newQuiz = await (new Quiz({ name, author, questions: questionIds })).save();
  const quiz = await Quiz.findById(newQuiz._id);
  res.status(201).json(quiz);
}

exports.get = async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return next({ status: 404, message: `No quiz with id ${req.params.id} exists.` });
  }

  res.status(200).json(quiz);
}

exports.getAll = async (req, res, next) => {
  const quizzes = await Quiz.find().sort({ created: 'desc' });
  res.status(200).json(quizzes);
}

exports.delete = async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return next({ status: 404, message: `No quiz with id ${req.params.id} exists.` });
  }

  // Only the author of the quiz can delete it
  if (!req.user._id.equals(quiz.author._id)) {
    return next({ status: 403, message: 'You are not the author of the quiz.' });
  }

  await Quiz.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Deleted successfully.' });
}

