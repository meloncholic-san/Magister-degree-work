//client/src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1]; // Беремо середню частину
        const decodedPayload = atob(payload); // Декодуємо з Base64
        return JSON.parse(decodedPayload); // Парсимо JSON
    } catch (error) {
        console.error('Помилка декодування токена:', error);
        return null;
    }
};

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    const isTokenExpired = () => {
        if (!token) return true;

        const decodedToken = decodeToken(token);
        if (!decodedToken) return true;

        return decodedToken.exp < Date.now() / 1000;
    };

    if (isTokenExpired()) {
        localStorage.removeItem('token'); // Видаляємо прострочений токен
        return <Navigate to="/login" />;
    }

    return children; // Якщо токен валідний, дозволяємо доступ
};

export default PrivateRoute;
