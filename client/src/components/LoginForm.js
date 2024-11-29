// client/src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Очищення повідомлення про помилку перед новим запитом

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Вхід успішний');
                localStorage.setItem('token', data.token);
                const decoded = jwtDecode(data.token);
                console.log(`Вітаємо, ${decoded.firstName} ${decoded.lastName}!`);
                navigate('/'); // Перенаправлення на головну сторінку
            } else {
                setError(data.message || 'Помилка входу');
            }
        } catch (error) {
            console.error('Помилка входу:', error);
            setError('Не вдалося з’єднатися із сервером');
        }
    };

    return (
        <div className="form-div">
        <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="form-title">Вхід</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label className="form-label">Логін</label>
                <input
                    className="form-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Пароль</label>
                <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button className="form-button" type="submit">Увійти</button>
            <p className="switch-form">
                Немає особового кабінету? <a href="/register">Зареєструватись</a>
            </p>
        </form>
        </div>
    );
};

export default LoginForm;
