const express = require('express');
const router = express.Router();
const osbbStatisticsController = require('../controllers/osbbStatisticsController');

// Маршрути
router.get('/', osbbStatisticsController.getAllStatistics); // Видалено /statistics
router.post('/', osbbStatisticsController.createStatistic); // Видалено /statistics
router.delete('/:id', osbbStatisticsController.deleteStatistic); // Видалено /statistics



module.exports = router;
