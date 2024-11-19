// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Токен відсутній' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded; // Зберігаємо розшифровані дані токена в req.user
        //console.log('Decoded token:', decoded);//////////////////////////////////////////////////////////перевірка генерації токена

        next();
    } catch (error) {
        res.status(403).json({ message: 'Недійсний токен' });
    }
};
