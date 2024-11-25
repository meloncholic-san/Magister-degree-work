//server/models/osbbStatistics.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Схема для ОСББ-статистики
const OsbbStatisticsSchema = new Schema({
  purpose: { // Призначення збору (наприклад, "Ремонт даху", "Оплата комунальних послуг")
    type: String,
    required: true,
  },
  totalAmount: { // Загальна сума, яку потрібно зібрати
    type: Number,
    required: true,
    default: 0,
  },
  collectedAmount: { // Сума, яку вже зібрали
    type: Number,
    required: true,
    default: 0,
  },
  debt: { // Борг (різниця між totalAmount і collectedAmount)
    type: Number,
    required: true,
    default: function () {
      return this.totalAmount - this.collectedAmount;
    },
  },
  payments: [ // Масив історії платежів
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Хто зробив платіж
      amount: { type: Number, required: true }, // Сума платежу
      date: { type: Date, required: true, default: Date.now }, // Дата платежу
    },
  ],
}, { timestamps: true }); // timestamps додає createdAt та updatedAt

module.exports = mongoose.model('OsbbStatistics', OsbbStatisticsSchema);
