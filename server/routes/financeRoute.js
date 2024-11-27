const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getActiveCollections } = require('../controllers/financeController');
const router = express.Router();

// Отримати активні збори з внесками
router.get('/active-collections',verifyToken, getActiveCollections);

module.exports = router;

