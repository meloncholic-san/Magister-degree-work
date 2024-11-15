// config/db.js
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB підключено');
    } catch (err) {
        console.error('Помилка підключення до MongoDB:', err.message);
        process.exit(1); // Завершуємо процес у разі помилки підключення
    }
};

module.exports = connectDB;

