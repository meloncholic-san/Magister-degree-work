// server/routes/paymentRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { createPayment, getPaymentStatus } = require('../controllers/paymentController');
const router = express.Router();

// Роут для створення платежу з перевіркою токена
router.post('/create', verifyToken, createPayment);

// Роут для перевірки статусу платежу
router.get('/status/:orderId', verifyToken, getPaymentStatus);

module.exports = router;
