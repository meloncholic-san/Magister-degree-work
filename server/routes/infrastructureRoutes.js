const express = require('express');
const router = express.Router();
const { 
  getConsumptionStatistics, 
  updateConsumptionStatistics, 
  createConsumptionStatistics, 
  getInfrastructureStatus, 
  updateInfrastructureStatus, 
  createInfrastructureStatus 
} = require('../controllers/infrastructureController');
const { verifyToken } = require('../middleware/authMiddleware');

// Отримання статистики споживання
router.get('/consumption', verifyToken, getConsumptionStatistics);

// Оновлення статистики споживання
router.put('/consumption', verifyToken, updateConsumptionStatistics);

// Створення статистики споживання
router.post('/consumption', verifyToken, createConsumptionStatistics);

// Отримання статусу інфраструктури
router.get('/infrastructure', verifyToken, getInfrastructureStatus);

// Оновлення статусу інфраструктури
router.put('/infrastructure', verifyToken, updateInfrastructureStatus);

// Створення запису для інфраструктури
router.post('/infrastructure', verifyToken, createInfrastructureStatus);

module.exports = router;
