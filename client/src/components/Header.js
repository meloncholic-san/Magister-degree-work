// client/src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="main-header">
      <h1 className="main-header-title">Панель керування ОСББ</h1>
      <nav className="main-header-nav">
        <Link to="/" className="main-header-link">Головна</Link>
        <Link to="/voting" className="main-header-link">Голосування</Link>
        <Link to="/infrastructure" className="main-header-link">Інфраструктура</Link>
      </nav>
    </header>
  );
};

export default Header;
