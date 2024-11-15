// // server/routes/userRoutes.js
// const express = require('express');
// const User = require('../models/User'); // Імпортуємо модель користувача
// const router = express.Router();

// // Реєстрація користувача
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, firstName, lastName, apartmentNumber } = req.body;

//         // Перевірка, чи існує користувач з таким ім'ям
//         let existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Користувач із таким логіном вже існує' });
//         }

//         // Створення нового користувача
//         const user = new User({
//             username,
//             password,
//             firstName,
//             lastName,
//             apartmentNumber,
//         });

//         // Збереження користувача
//         await user.save();

//         res.status(201).json({ message: 'Користувач успішно зареєстрований' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// });

// module.exports = router;


// // Регистрация пользователя
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, firstName, lastName, apartmentNumber } = req.body;

//         let existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Користувач із таким логіном вже існує' });
//         }

//         const user = new User({
//             username,
//             email,
//             password,
//             firstName,
//             lastName,
//             apartmentNumber,
//         });

//         await user.save();

//         res.status(201).json({ message: 'Користувач успішно зареєстрований' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// });





// server/routes/userRoutes.js
const express = require('express');
const User = require('../models/User'); // Ипортируем модель пользователя
const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, apartmentNumber } = req.body;

        // Проверка, существует ли пользователь с таким email
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email вже використовується' });
        }

        // Создание нового пользователя
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            apartmentNumber,
        });

        // Сохранение пользователя в базе данных
        await user.save();

        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});


// Получить всех пользователей
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Получаем всех пользователей
        res.json(users); // Отправляем список пользователей в ответе
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

//new
const { registerUser, loginUser } = require('../controllers/userController'); // Імпортуємо loginUser


router.post('/register', registerUser); // Маршрут для реєстрації
router.post('/login', loginUser); // Маршрут для входу


module.exports = router;






