const mongoose = require('mongoose');

const UserPaymentSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true }, // Посилання на користувача
  orderId: { type: String, unique: true, required: true }, // Унікальний ідентифікатор замовлення LiqPay
  paymentId: { type: String, required: false }, // Ідентифікатор транзакції LiqPay (при успішній оплаті)
  amount: { type: Number, required: true }, // Сума платежу
  currency: { type: String, default: 'UAH' }, // Валюта
  status: { type: String, default: 'pending' }, // Статус (pending, success, failure)
  description: { type: String, required: false }, // Опис платежу
  createdAt: { type: Date, default: Date.now }, // Дата створення
  updatedAt: { type: Date, default: Date.now }, // Останнє оновлення
});

module.exports = mongoose.model('UserPayment', UserPaymentSchema);
