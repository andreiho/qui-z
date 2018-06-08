const express = require('express');
const router = express.Router();
const { celebrate, Joi } = require('celebrate');

const { catchErrors } = require('../handlers/error');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.get(['/', '/api'], (req, res, next) => {
  res.send('Welcome to the qui-z API!');
});

router.post('/api/register',
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

router.post('/api/login',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  authController.login
);

router.get('/api/logout', authController.logout);

module.exports = router;