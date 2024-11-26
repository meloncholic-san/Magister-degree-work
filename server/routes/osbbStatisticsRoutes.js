const express = require('express');
const router = express.Router();
const osbbStatisticsController = require('../controllers/osbbStatisticsController');

// Маршрути
router.get('/', osbbStatisticsController.getAllStatistics); 
router.post('/', osbbStatisticsController.createStatistic); 
router.delete('/:id', osbbStatisticsController.deleteStatistic); 



module.exports = router;
