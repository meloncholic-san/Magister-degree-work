const Infrastructure = require('../models/infrastructure');
const ConsumptionStatistics = require('../models/consumptionStatisticsModel');

// Отримання статусу інфраструктури
const getInfrastructureStatus = async (req, res) => {
  try {
    const status = await Infrastructure.findOne();
    if (!status) {
      return res.status(404).json({ message: 'Статус інфраструктури не знайдено' });
    }
    res.json(status);
  } catch (error) {
    console.error('Помилка при отриманні статусу інфраструктури:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

// Оновлення статусу інфраструктури
const updateInfrastructureStatus = async (req, res) => {
  try {
    const { cargoElevatorStatus, passengerElevatorStatus, utilityStatus } = req.body;
    const updatedStatus = await Infrastructure.findOneAndUpdate(
      {},
      { cargoElevatorStatus, passengerElevatorStatus, utilityStatus },
      { new: true, upsert: true }
    );
    res.json(updatedStatus);
  } catch (error) {
    console.error('Помилка при оновленні статусу інфраструктури:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

// Отримання статистики споживання
const getConsumptionStatistics = async (req, res) => {
  try {
    const { month, year } = req.query;
    const statistics = await ConsumptionStatistics.findOne({ month, year });
    if (!statistics) {
      return res.status(404).json({ message: 'Статистика споживання не знайдена' });
    }
    res.json(statistics);
  } catch (error) {
    console.error('Помилка при отриманні статистики споживання:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

// Оновлення статистики споживання
const updateConsumptionStatistics = async (req, res) => {
  try {
    const { month, year, waterConsumption, gasConsumption, electricityConsumption } = req.body;
    console.log(month,year);
    const updatedStatistics = await ConsumptionStatistics.findOneAndUpdate(

      { month, year },
      { waterConsumption, gasConsumption, electricityConsumption },
      { new: true, upsert: true }
    );
    res.json(updatedStatistics);
  } catch (error) {
    console.error('Помилка при оновленні статистики споживання:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};


// Створення нового запису для інфраструктури
const createInfrastructureStatus = async (req, res) => {
    try {
      const { cargoElevatorStatus, passengerElevatorStatus, utilityStatus } = req.body;
  
      const newInfrastructure = new Infrastructure({
        cargoElevatorStatus,
        passengerElevatorStatus,
        utilityStatus,
      });
  
      await newInfrastructure.save();
      res.status(201).json({ message: 'Статус інфраструктури успішно створено', data: newInfrastructure });
    } catch (error) {
      console.error('Помилка при створенні інфраструктури:', error);
      res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
  };
  
  // Створення нового запису статистики споживання
  const createConsumptionStatistics = async (req, res) => {
    try {
      const { month, year, waterConsumption, gasConsumption, electricityConsumption } = req.body;
  
      const newStatistics = new ConsumptionStatistics({
        month,
        year,
        waterConsumption,
        gasConsumption,
        electricityConsumption,
      });
  
      await newStatistics.save();
      res.status(201).json({ message: 'Статистика споживання успішно створена', data: newStatistics });
    } catch (error) {
      console.error('Помилка при створенні статистики споживання:', error);
      res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
  };




module.exports = {
  getInfrastructureStatus,
  updateInfrastructureStatus,
  getConsumptionStatistics,
  updateConsumptionStatistics,
  createConsumptionStatistics,
  createInfrastructureStatus,
};
