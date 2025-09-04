const express = require('express');

const router = express.Router();

const occurrencesController = require('./controllers/occurrencesController');
const occurrencesMiddleware = require('./middlewares/occurrencesMiddleware');

router.get('/occurrences', occurrencesController.getAll);
router.post('/occurrences', occurrencesMiddleware.validateFieldTitle, occurrencesController.createOccurrence);
router.delete('/occurrences/:id', occurrencesController.deleteOccurrence);
router.put('/occurrences/:id',
  occurrencesMiddleware.validateFieldTitle,
  occurrencesMiddleware.validateFieldStatus,
  occurrencesController.updateOccurrence,
);

module.exports = router;