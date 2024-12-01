const mongoose = require('mongoose');

const consumptionStatisticsSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  waterConsumption: {
    type: Number, // у кубічних метрах
    required: true,
  },
  gasConsumption: {
    type: Number, // у кубічних метрах
    required: true,
  },
  electricityConsumption: {
    type: Number, // у кіловат-годинах
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ConsumptionStatistics', consumptionStatisticsSchema);
