// client/src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Головна сторінка</h1>
            <p>Вітаємо на головній сторінці вашої платформи.</p>
            <nav>
                <Link to="/register">Реєстрація</Link> | <Link to="/login">Вхід</Link>
            </nav>
        </div>
    );
};

export default Home;
