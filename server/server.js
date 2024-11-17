// // server.js
// require('dotenv').config({ path: './server/config/.env' });  // Завантажуємо змінні з .env
// 1
// const express = require('express');
// const connectDB = require('./db');
// const userRoutes = require('./routes/userRoutes');

// const app = express();

// // Підключення до MongoDB
// connectDB();

// // Middleware для обробки JSON
// app.use(express.json());

// // Використання роутів
// app.use('/api/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Сервер запущено на порту ${PORT}`);
// });

// server/server.js
// require('dotenv').config( { path: './server/config/.env' } );
// const express = require('express');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Підключення до MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// // Middleware для обробки JSON
// app.use(express.json());

// // Підключення роутів
// app.use('/api/users', userRoutes);

// app.listen(PORT, () => {
//     console.log(`Сервер запущено на порту ${PORT}`);
// });

// server/server.js
require('dotenv').config( { path: './server/config/.env' });
const express = require('express');
const cors = require('cors');

const connectDB = require('./db'); // Імпортуємо функцію для підключення до бази
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});


const chatRoutes = require('./routes/chatRoutes');
app.use('/api/messages', chatRoutes);
