
// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';  // Компонент для страницы входа
import Home from './components/Home'; // Главная страница
import PrivateRoute from './components/PrivateRoute';
import MainPage from './components/mainPage';

import './styles/styles.css'; // Підключення єдиного файлу стилів

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App;