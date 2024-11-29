// server/routes/adRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { createAd, getActiveAds, markAdAsCompleted, activateAd, dismissAd, getPendingAds } = require('../controllers/adController');
const router = express.Router();

// Створити нове оголошення
router.post('/create', verifyToken, createAd);

// Отримати всі активні оголошення
router.get('/active', verifyToken, getActiveAds);

// Змінити статус оголошення на "completed"
router.patch('/complete/:adId', verifyToken, markAdAsCompleted);

router.patch('/activate/:adId', verifyToken, activateAd);
router.patch('/dismiss/:adId', verifyToken, dismissAd);
router.get('/pending', verifyToken, getPendingAds);



module.exports = router;
