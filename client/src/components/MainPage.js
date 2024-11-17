//client/src/components/MainPage.js
import React from 'react';
import ChatModule from './ChatModule';

const MainPage = () => {
    return (
        <div className="container">
            <header className="header">
                <h1>Панель керування ОСББ</h1>
            </header>

            <main className="main">
                <section className="module">
                    <h2>Модуль комунікації</h2>
                    <ChatModule />
                </section>
                <section className="module">
                    <h2>Модуль прийняття колективних рішень</h2>
                    <p>Місце для модуля прийняття рішень</p>
                </section>
                <section className="module">
                    <h2>Фінансовий модуль</h2>
                    <p>Місце для фінансового модуля</p>
                </section>
                <section className="module">
                    <h2>Модуль моніторингу інфраструктури</h2>
                    <p>Місце для модуля моніторингу інфраструктури</p>
                </section>
            </main>
        </div>
    );
};

export default MainPage;
