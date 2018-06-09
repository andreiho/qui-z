const mongoose = require('mongoose');
const { map } = require('lodash');

const Quiz = mongoose.model('Quiz');
const Question = mongoose.model('Question');
const Response = mongoose.model('Response');

exports.create = async (req, res) => {
  const quizId = req.params.id;
  const author = req.user._id;
  const answers = map(req.body, (answer, question) => ({ answer, question }));

  const quiz = await Quiz.findById(quizId);
  const newResponse = await (new Response({ quiz: quizId, answers, author })).save();
  const response = await Response.findById(newResponse._id);

  res.status(200).json(response);
}