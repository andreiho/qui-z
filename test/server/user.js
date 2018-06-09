const mongoose = require('mongoose');
const supertest = require('supertest');
const expect = require('unexpected');
const config = require('config');

const User = require('../../src/server/models/user');
const { clean } = require('./helpers');
const server = require('../../src/server/start');
const agent = supertest(server);

describe('User', () => {
  before(done => {
    clean([ User ]).then(() => done()).catch(done);
  });

  after(done => {
    clean([ User ]).then(() => done()).catch(done);
  });

  context('Register', () => {
    it('should register a new user', done => {
      const user = {
        email: 'test@example.com',
        name: 'John Smith',
        password: 'test123',
        passwordConfirmation: 'test123'
      };

      agent
        .post('/api/register')
        .send(user)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body, 'to be an object');
          expect(res.body.email, 'to be', user.email);
          expect(res.body.name, 'to be', user.name);

          done();
        });
    });

    it('should fail registering a user with the same e-mail address', done => {
      const user = {
        email: 'test@example.com',
        name: 'Jane Smith',
        password: 'test123',
        passwordConfirmation: 'test123'
      };

      agent.post('/api/register').send(user).expect(404, done);
    });

    it('should fail registering a user without an e-mail address', done => {
      const user = {
        name: 'Jane Smith',
        password: 'test123',
        passwordConfirmation: 'test123'
      };

      agent.post('/api/register').send(user).expect(400, done);
    });

    it('should fail registering a user without a name', done => {
      const user = {
        email: 'test@example.com',
        password: 'test123',
        passwordConfirmation: 'test123'
      };

      agent.post('/api/register').send(user).expect(400, done);
    });

    it('should fail registering a user without a password', done => {
      const user = {
        email: 'test@example.com',
        name: 'John Doe'
      };

      agent.post('/api/register').send(user).expect(400, done);
    });

    it('should fail registering a user without confirming the password', done => {
      const user = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'test123'
      };

      agent.post('/api/register').send(user).expect(400, done);
    });

    it('should fail registering a user if the passwords do not match', done => {
      const user = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'test123',
        passwordConfirmation: 'test1234'
      };

      agent.post('/api/register').send(user).expect(400, done);
    });
  });

  context('Login', () => {
    it('should log in a user', done => {
      const user = {
        email: 'test@example.com',
        password: 'test123'
      };

      agent
        .post('/api/login')
        .send(user)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.sessionId, 'to be defined');
          expect(res.body.user, 'to be defined');
          expect(res.body.user.email, 'to be', user.email);
          expect(res.headers['set-cookie'], 'not to be empty');
          expect(res.headers['set-cookie'], 'to have an item satisfying', cookie => {
            expect(cookie, 'to contain', `${config.get('auth.key')}=`);
          });

          done();
        });
    });

    it('should not log in a user if the e-mail is not specified', done => {
      const user = {
        password: 'test123'
      };

      agent.post('/api/login').send(user).expect(400, done);
    });

    it('should not log in a user if the password is not specified', done => {
      const user = {
        email: 'test@example.com'
      };

      agent.post('/api/login').send(user).expect(400, done);
    });

    it('should not log in a user that does not exist', done => {
      const user = {
        email: 'does-not-exist@example.com',
        password: '123'
      };

      agent.post('/api/login').send(user).expect(401, done);
    });

    it('should not log in a user with the wrong password', done => {
      const user = {
        email: 'test@example.com',
        password: 'test1234'
      };

      agent.post('/api/login').send(user).expect(401, done);
    });
  });
});