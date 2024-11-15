// client/src/components/RegisterForm.js
import React, { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '', // Добавлено поле для email
        password: '',
        firstName: '',
        lastName: '',
        apartmentNumber: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Реєстрація пройшла успішно');
            } else {
                alert(`Помилка: ${data.message}`);
            }
        } catch (error) {
            console.error('Помилка реєстрації:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Реєстрація</h2>
            <div>
                <label>Логін</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
                <label>Пароль</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Ім'я</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div>
                <label>Прізвище</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div>
                <label>Номер квартири</label>
                <input type="text" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} required />
            </div>
            <button type="submit">Зареєструватися</button>
        </form>
    );
};

export default RegisterForm;
