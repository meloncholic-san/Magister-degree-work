const mongoose = require('mongoose');

const infrastructureSchema = new mongoose.Schema({
  cargoElevatorStatus: {
    type: String,
    required: true,
    enum: ['Норма', 'Вимкнуто', 'Обслуговується'],
  },
  passengerElevatorStatus: {
    type: String,
    required: true,
    enum: ['Норма', 'Вимкнуто', 'Обслуговується'],
  },
  utilityStatus: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Infrastructure', infrastructureSchema);
