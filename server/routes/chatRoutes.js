//server/routes/chatRoutes.js

// // Додати нове повідомлення
// router.post('/', async (req, res) => {
//     try {
//         const { text } = req.body;
//         const newMessage = new Message({ text });
//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (error) {
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// });

// router.post('/', async (req, res) => {
//     try {
//         const { text } = req.body;
//         const user = req.user; // Декодуємо користувача з токена (додайте middleware для аутентифікації)
        
//         const newMessage = new Message({
//             text,
//             user: {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 apartment: user.apartmentNumber,
//             },
//         });

//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// });


// module.exports = router;

// //server/routes/chatRoutes.js
// const express = require('express');
// const router = express.Router();
// const Message = require('../models/Message.js'); // Модель повідомлень
// const { verifyToken } = require('../middleware/authMiddleware'); // Імпортуємо middleware

// // Отримати всі повідомлення
// router.get('/', async (req, res) => {
//     try {
//         const messages = await Message.find();
//         res.json(messages);
//     } catch (error) {
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// });

// // Додати нове повідомлення (потребує авторизації)
// router.post('/', verifyToken, async (req, res) => {
//     try {
//         const { text } = req.body;

//         // Використовуємо розшифровані дані користувача з токена
//         const user = req.user;

//         const newMessage = new Message({
//             text,
//             user: {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 apartment: user.apartmentNumber,
//             },
//         });

//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Помилка сервера' });
//     }
// });

// module.exports = router;






// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js'); // Модель повідомлень
const { verifyToken } = require('../middleware/authMiddleware'); // Імпортуємо middleware

// Отримати всі повідомлення, відсортовані від найновішого до найстарішого
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find() //.sort({ createdAt: -1 }); // Сортуємо по полю createdAt, -1 для від найновішого
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Додати нове повідомлення (потребує авторизації)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { text } = req.body;

        // Використовуємо розшифровані дані користувача з токена
        const user = req.user;

        const newMessage = new Message({
            text,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                apartment: user.apartmentNumber,
            },
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

module.exports = router;
