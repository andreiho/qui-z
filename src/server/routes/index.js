const express = require('express');
const router = express.Router();
const { celebrate, Joi } = require('celebrate');

const { catchErrors } = require('../handlers/error');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const quizController = require('../controllers/quizController');
const responseController = require('../controllers/responseController');

router.get('/', (req, res, next) => {
  res.send('Welcome to the qui-z API!');
});

/**
 * Register a user
 */
router.post('/register',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')).required()
    }
  }),
  catchErrors(userController.register),
  authController.login
);

/**
 * Log in a user
 */
router.post('/login',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  authController.login
);

/**
 * Log out a user
 */
router.get('/logout', authController.logout);

/**
 * Create a quiz
 */
router.post('/quiz',
  authController.isLoggedIn,
  celebrate({
    body: {
      name: Joi.string().required(),
      questions: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          option1: Joi.string().required(),
          option2: Joi.string().required(),
          option3: Joi.string().required(),
          option4: Joi.string().required(),
          correctAnswer: Joi.number().integer().required()
        })
      ).min(1).required()
    }
  }),
  catchErrors(quizController.create)
);

/**
 * Get a quiz
 */
router.get('/quiz/:slug',
  authController.isLoggedIn,
  celebrate({
    params: {
      slug: Joi.string().required()
    }
  }),
  catchErrors(quizController.get)
);

/**
 * Get all quizzes
 */
router.get('/quiz',
  authController.isLoggedIn,
  catchErrors(quizController.getAll)
);

/**
 * Delete a quiz
 */
router.delete('/quiz/:id',
  authController.isLoggedIn,
  celebrate({
    params: {
      id: Joi.string().required()
    }
  }),
  catchErrors(quizController.delete)
);

/**
 * Submit a response to a quiz
 */
router.post('/quiz/:id/response',
  authController.isLoggedIn,
  celebrate({
    params: {
      id: Joi.string().required()
    },
    body: Joi.object().pattern(/^/, Joi.number().integer()).required()
  }),
  catchErrors(responseController.create)
);

module.exports = router;