// client/src/App.js
// import React from 'react';
// import RegisterForm from './components/RegisterForm';

// const App = () => {
//     return (
//         <div>
//             <h1>Ласкаво просимо до системи ОСББ</h1>
//             <RegisterForm />
//         </div>
//     );
// };

// export default App;


// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';  // Компонент для страницы входа
import Home from './components/Home'; // Главная страница
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App;