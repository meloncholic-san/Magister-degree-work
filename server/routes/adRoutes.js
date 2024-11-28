// server/routes/adRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { createAd, getActiveAds, markAdAsCompleted } = require('../controllers/adController');
const router = express.Router();

// Створити нове оголошення
router.post('/create', verifyToken, createAd);

// Отримати всі активні оголошення
router.get('/active', verifyToken, getActiveAds);

// Змінити статус оголошення на "completed"
router.patch('/complete/:adId', verifyToken, markAdAsCompleted);

module.exports = router;
