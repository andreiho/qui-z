const mongoose = require('mongoose');
const supertest = require('supertest');
const expect = require('unexpected');

const Quiz = require('../../src/server/models/quiz');
const Question = require('../../src/server/models/question');
const User = require('../../src/server/models/user');
const { clean } = require('./helpers');
const server = require('../../src/server/start');
const agent = supertest(server);

describe('Quiz', () => {
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
    clean([ User, Quiz, Question ])
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
    clean([ User, Quiz, Question ]).then(() => done()).catch(done);
  });

  context('Create', () => {
    it('should create a new quiz', done => {
      mockAuth('post', '/api/quiz')
        .send(quiz)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          quizId = res.body._id;
          expect(res.body.name, 'to be', quiz.name);
          expect(res.body.slug, 'to be', 'test-quiz');
          expect(res.body.author, 'to be defined');
          expect(res.body.author.email, 'to be', user.email);
          expect(res.body.author.name, 'to be', user.name);
          expect(res.body.questions, 'to be an array').and('to have length', quiz.questions.length);
          expect(res.body.questions[0].correctAnswer, 'to be undefined');

          done();
        });
    });

    it('should fail creating a quiz without a name', done => {
      const quiz = {
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

      mockAuth('post', '/api/quiz').send(quiz).expect(400, done);
    });

    it('should fail creating a quiz without at least one question', done => {
      const quiz = {
        name: 'Test Quiz',
        questions: []
      };

      mockAuth('post', '/api/quiz').send(quiz).expect(400, done);
    });

    it('should fail creating a quiz if not logged in', done => {
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

      agent.post('/api/quiz').send(quiz).expect(401, done);
    });
  });

  context('Retrieve', () => {
    it('should retrieve a quiz', done => {
      mockAuth('get', '/api/quiz/test-quiz')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body._id, 'to be', quizId);
          expect(res.body.name, 'to be', quiz.name);
          expect(res.body.slug, 'to be', 'test-quiz');
          expect(res.body.author, 'to be defined');
          expect(res.body.author.email, 'to be', user.email);
          expect(res.body.author.name, 'to be', user.name);
          expect(res.body.questions, 'to be an array').and('to have length', quiz.questions.length);
          expect(res.body.questions[0].correctAnswer, 'to be undefined');

          done();
        });
    });

    it('should fail retrieving a quiz that does not exist', done => {
      mockAuth('get', '/api/quiz/does-not-exist').expect(404, done);
    });

    it('should fail retrieving if not logged in', done => {
      agent.get('/api/quiz/test-quiz').expect(401, done);
    });

    it('should retrieve all quizzes', done => {
      mockAuth('get', '/api/quiz')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body, 'to be an array');
          expect(res.body, 'to have length', 1);
          expect(res.body, 'to have an item satisfying', item => {
            expect(item._id, 'to be', quizId);
            expect(item.name, 'to be', quiz.name);
            expect(item.slug, 'to be', 'test-quiz');
            expect(item.author, 'to be defined');
            expect(item.author.email, 'to be', user.email);
            expect(item.author.name, 'to be', user.name);
            expect(item.questions, 'to be an array').and('to have length', quiz.questions.length);
            expect(item.questions[0].correctAnswer, 'to be undefined');
          });

          done();
        });
    });
  });

  context('Delete', () => {
    it('should delete a quiz', done => {
      mockAuth('delete', `/api/quiz/${quizId}`)
        .expect(200)
        .end(err => {
          if (err) return done (err);
          mockAuth('get', `/api/quiz/${quizId}`).expect(404, done);
        });
    });

    it('should fail deleting a quiz without an id', done => {
      mockAuth('delete', '/api/quiz').expect(404, done);
    });

    it('should fail deleting a quiz with a malformed id', done => {
      mockAuth('delete', '/api/quiz/not-a-valid-id').expect(500, done);
    });

    it('should fail deleting a quiz that does not exist', done => {
      mockAuth('delete', '/api/quiz/5b1afb348728da12127ec088').expect(404, done);
    });

    it('should fail deleting if not logged in', done => {
      agent.delete(`/api/quiz/${quizId}`).expect(401, done);
    });
  });
});