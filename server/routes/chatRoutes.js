


// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js'); // Модель повідомлень
const { verifyToken } = require('../middleware/authMiddleware'); // Імпортуємо middleware

// Отримати всі повідомлення з пагінацією, відсортовані від найновішого до найстарішого
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Номер сторінки (за замовчуванням 1)
        const limit = parseInt(req.query.limit) || 10; // Кількість повідомлень на сторінку (за замовчуванням 10)

        const messages = await Message.find()
            .skip((page - 1) * limit) // Пропускаємо повідомлення на попередніх сторінках
            .limit(limit); // Обмежуємо кількість повідомлень на поточній сторінці

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});


// Додати нове повідомлення
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


// Удаление сообщения (только если сообщение создано пользователем или пользователь - админ)


// server/routes/chatRoutes.js
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const messageId = req.params.id;

        // Найти сообщение по ID
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Повідомлення не знайдено' });
        }

        // Проверить права на удаление: пользователь - создатель сообщения или админ
        const user = req.user; // req.user содержит данные токена
        const isAdmin = user.role === 'admin';
        const isOwner =
            user.firstName === message.user.firstName &&
            user.lastName === message.user.lastName;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Видалення заборонено' });
        }

        // Удаление сообщения
        await Message.deleteOne({ _id: messageId });
        res.status(200).json({ message: 'Повідомлення видалено успішно' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});




module.exports = router;

