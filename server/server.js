
// server/server.js

require('dotenv').config( { path: './server/config/.env' });
const express = require('express');
const cors = require('cors');

const connectDB = require('./db'); // Імпортуємо функцію для підключення до бази
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


const chatRoutes = require('./routes/chatRoutes');

// Підключення до MongoDB
connectDB();
// Разрешаем все домены
app.use(cors());

// Если нужно, можно ограничить доступ только к вашему frontend домену:
// app.use(cors({ origin: 'http://localhost:3000' }));

// Подключите остальные middleware и маршруты


// Middleware для обробки JSON
app.use(express.json());

// Підключення роутів
app.use('/api/users', userRoutes);
app.use('/api/messages', chatRoutes);

// Подключаем маршруты голосования
const voteRoutes = require('./routes/votes.js');
app.use('/api/votes', voteRoutes);


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});




