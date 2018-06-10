const mongoose = require('mongoose');
const supertest = require('supertest');
const expect = require('unexpected');

const Quiz = require('../../src/server/models/quiz');
const Question = require('../../src/server/models/question');
const User = require('../../src/server/models/user');
const Response = require('../../src/server/models/response');
const { clean } = require('./helpers');
const server = require('../../src/server/start');
const agent = supertest(server);

describe('Response', () => {
  let cookies;
  let quizId;

  const user = {
    email: 'test@example.com',
    name: 'John Smith',
    password: 'test123',
    passwordConfirmation: 'test123'
  };
  const quiz = {
    name: 'Test Quiz',
    questions: [{
      "name": "Test Question 1",
      "option1": "Option 1",
      "option2": "Option 2",
      "option3": "Option 3",
      "option4": "Option 4",
      "correctAnswer": 1
    }, {
      "name": "Test Question 2",
      "option1": "Option 1",
      "option2": "Option 2",
      "option3": "Option 3",
      "option4": "Option 4",
      "correctAnswer": 2
    }]
  };

  const mockAuth = (method, path) => {
    const req = agent[method](path);
    req.cookies = cookies;
    return req;
  };

  before(done => {
    clean([ User, Quiz, Question, Response ])
      .then(() => {
        agent
          .post('/api/register')
          .send(user)
          .expect(200)
          .end((err) => {
            if (err) return done(err);

            agent
              .post('/api/login')
              .send({ email: user.email, password: user.password })
              .expect(200)
              .end((loginErr, res) => {
                if (loginErr) return done(loginErr);

                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
              });
          });
      })
      .catch(done);
  });

  after(done => {
    clean([ User, Quiz, Question, Response ]).then(() => done()).catch(done);
  });

  it('should create a response to a quiz', done => {
    mockAuth('post', '/api/quiz')
      .send(quiz)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);

        quizId = res.body._id;

        const response = res.body.questions.reduce((result, question) => {
          result[question._id] = 1;
          return result;
        }, {});

        mockAuth('post', `/api/quiz/${quizId}/response`)
          .send(response)
          .expect(200)
          .end((responseErr, responseRes) => {
            if (responseErr) return done(responseErr);

            expect(responseRes.body.quiz, 'to be', quizId);
            expect(responseRes.body.answers, 'to be an array').and('to have length', 2);
            expect(responseRes.body.answers, 'to have items satisfying', item => {
              expect(item.answer, 'to be', 1);
              expect(item.question, 'to be an object');
            });

            done();
          });
      });
  });
});