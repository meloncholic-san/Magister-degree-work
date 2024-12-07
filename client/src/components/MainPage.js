import React from 'react';
import { Link } from 'react-router-dom';
import ChatModule from './ChatModule';
import VotingModule from './VotingModule'; 
import FinanceModule from './FinanceModule';
import AdModule from './AdModule';
import InfrastructureModule from './InfrastructureModule';
import Header from './Header';
const MainPage = () => {
    return (
        <div className='main-header-1'>
        <Header />
        <div className="main-container">
            <main className="main-layout">
                <section className="main-ads" id="ads">
                    <AdModule />
                </section>
                <section className="main-chat">
                    <ChatModule />
                </section>
                <section className="main-finance" id="finance">
                    <FinanceModule />
                </section>
            </main>
        </div>
        </div>
    );
};

export default MainPage;
