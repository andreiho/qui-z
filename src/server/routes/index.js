const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/api', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;