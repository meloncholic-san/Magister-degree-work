//server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js'); // Модель повідомлень

// Отримати всі повідомлення
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Додати нове повідомлення
router.post('/', async (req, res) => {
    try {
        const { text } = req.body;
        const newMessage = new Message({ text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

module.exports = router;
