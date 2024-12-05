
// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import MainPage from './components/mainPage';
import VotingModule from './components/VotingModule';
import FinanceModule from './components/FinanceModule';
import InfrastructureModule from './components/InfrastructureModule';
import AdModule from './components/AdModule';

import './styles/styles.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/voting" element={<PrivateRoute><VotingModule /></PrivateRoute>} />
                <Route path="/finance" element={<PrivateRoute><FinanceModule /></PrivateRoute>} />
                <Route path="/infrastructure" element={<PrivateRoute><InfrastructureModule /></PrivateRoute>} />
                <Route path="/ads" element={<PrivateRoute><AdModule /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
