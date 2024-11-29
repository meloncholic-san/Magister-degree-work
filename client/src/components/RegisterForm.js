// client/src/components/RegisterForm.js
import React, { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
        <div className="form-div">
        <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="form-title">Реєстрація</h2>
            <div className="form-group">
                <label className="form-label">Логін</label>
                <input className="form-input" type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Пароль</label>
                <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Ім'я</label>
                <input className="form-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Прізвище</label>
                <input className="form-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Номер квартири</label>
                <input className="form-input" type="text" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} required />
            </div>
            <button className="form-button" type="submit">Зареєструватися</button>
            <p className="switch-form">
                Уже є акаунт? <a href="/login">Увійти</a>
            </p>
        </form>
        </div>
    );
};

export default RegisterForm;
