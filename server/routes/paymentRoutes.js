// server/routes/paymentRoutes.js
const express = require('express');
const { createPayment, getPaymentStatus } = require('../controllers/paymentController');
const router = express.Router();

// Роут для створення платежу
router.post('/create', createPayment);

// Роут для перевірки статусу платежу
router.get('/status/:orderId', getPaymentStatus);

module.exports = router;
