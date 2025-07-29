const express = require('express');
const historyController = require('../controllers/historyController');

const router = express.Router();

router.get('/', historyController.getHistory);

router.delete('/', historyController.clearHistory);

module.exports = router;