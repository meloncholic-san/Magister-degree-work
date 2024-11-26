const express = require('express');
const { getActiveCollections } = require('../controllers/financeController');
const router = express.Router();

// Отримати активні збори з внесками
router.get('/active-collections', getActiveCollections);

module.exports = router;