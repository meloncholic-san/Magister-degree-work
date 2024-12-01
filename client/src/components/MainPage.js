//client/src/components/MainPage.js
import React from 'react';
import ChatModule from './ChatModule';
import VotingModule from './VotingModule'; 
import FinanceModule from './FinanceModule';
import AdModule from './adModule';
import Schedule from './TurnOffSchedule';
import InfrastructureModule from './InfrastructureModule';


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
                    <VotingModule />
                </section>
                <section className="module">
                    <h2>Фінансовий модуль</h2>

                    <FinanceModule /> 
                </section>
                <section className="module">
                    <h2>Модуль моніторингу інфраструктури</h2>
                    {/* <Schedule /> */}
                    <InfrastructureModule />
                </section>
                <section className="module">
                    <h2>Дошка оголошень</h2>
                    <AdModule /> {/* Виклик нового модуля */}
                </section>
            </main>
        </div>
    );
};

export default MainPage;
