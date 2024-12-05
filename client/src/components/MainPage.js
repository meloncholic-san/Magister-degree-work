import React from 'react';
import { Link } from 'react-router-dom';
import ChatModule from './ChatModule';
import VotingModule from './VotingModule'; 
import FinanceModule from './FinanceModule';
import AdModule from './AdModule';
import InfrastructureModule from './InfrastructureModule';

const MainPage = () => {
    return (
        <div className="main-container">
          <Header />

            <main className="main-layout">
                <section className="main-ads" id="ads">
                    <h2 className="main-ads-title">Оголошення</h2>
                    <AdModule />
                </section>
                <section className="main-chat">
                    <ChatModule />
                </section>
                <section className="main-finance" id="finance">
                    <h2 className="main-finance-title">Фінансовий модуль</h2>
                    <FinanceModule />
                </section>
            </main>
        </div>
    );
};

export default MainPage;
