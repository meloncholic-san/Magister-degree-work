
// server/controllers/userController.js
const { exec } = require('child_process');
const User = require('../models/User');

// Регистрация нового пользователя
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, apartmentNumber } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email є обов\'язковим' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email вже використовується' });

        user = new User({ username, email, password, firstName, lastName, apartmentNumber });
        await user.save();

        // После регистрации нового пользователя, экспортируем данные в CSV
        exportCollectionToCSV()
            .then(() => {
                console.log("Коллекция успешно экспортирована в CSV!");
            })
            .catch((err) => {
                console.error("Ошибка при экспорте коллекции:", err);
            });

        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

// Функция для экспорта коллекции в CSV
const exportCollectionToCSV = () => {
    return new Promise((resolve, reject) => {
        const command = 'mongoexport --uri="mongodb://localhost:27017/co-owners" --collection=users --type=csv --fields=username,email,firstName,lastName,apartmentNumber --out=./exports/users.csv';

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Ошибка: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
};


// server/controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// exports.loginUser = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Знайти користувача за логіном (username)
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ message: 'Невірний логін або пароль' });
//         }

//         // Перевірити пароль
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Невірний логін або пароль' });
//         }

//         // Створення JWT токену
//         const token = jwt.sign(
//             { userId: user._id, username: user.username },
//             process.env.JWT_SECRET,
//             { expiresIn: '10h' } // Термін дії токена — 4 годинu
//         );

//         res.json({ message: 'Вхід успішний', token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// };
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Знайти користувача за логіном (username)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Невірний логін або пароль' });
        }

        // Перевірити пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний логін або пароль' });
        }

        // Створення JWT токену (включено ім'я, прізвище та роль)
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                apartmentNumber: user.apartmentNumber, // Додано поле
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );
        

        res.json({ message: 'Вхід успішний', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
};
