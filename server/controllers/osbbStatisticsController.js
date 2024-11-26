//server/controllers/osbbStatisticsController.js
const OsbbStatistics = require('../models/OsbbStatistics');

// Отримати список усіх зборів
exports.getAllStatistics = async (req, res) => {
  try {
    const statistics = await OsbbStatistics.find().populate('payments.userId', 'name email');
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

// Створити новий збір
exports.createStatistic = async (req, res) => {
  const { purpose, totalAmount } = req.body;

  if (!purpose || !totalAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newStatistic = new OsbbStatistics({ purpose, totalAmount });
    await newStatistic.save();
    res.status(201).json(newStatistic);
  } catch (error) {
    console.error('Error creating statistic:', error.message);
    res.status(500).json({ message: 'Error creating statistic' });
  }
};

// Видалити збір
exports.deleteStatistic = async (req, res) => {
  const { id } = req.params;

  try {
    await OsbbStatistics.findByIdAndDelete(id);
    res.json({ message: 'Statistic deleted successfully' });
  } catch (error) {
    console.error('Error deleting statistic:', error.message);
    res.status(500).json({ message: 'Error deleting statistic' });
  }
};
