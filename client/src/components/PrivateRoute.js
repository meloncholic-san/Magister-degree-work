// client/src/components/PrivateRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//     const token = localStorage.getItem('token');
//     return token ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;

// // client/src/components/PrivateRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//     const token = localStorage.getItem('token');
//     const isTokenExpired = token ? jwt.decode(token).exp < Date.now() / 1000 : true;

//     if (!token || isTokenExpired) {
//         localStorage.removeItem('token');
//         return <Navigate to="/login" />;
//     }

//     return children;
// };

// export default PrivateRoute;





// //client/src/components/PrivateRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// const jwtDecode = require('jwt-decode');







// const PrivateRoute = ({ children }) => {
//     const token = localStorage.getItem('token');

//     // Перевіряємо термін дії токена
//     const isTokenExpired = () => {
//         if (!token) return true;

//         try {
//             const decodedToken = jwtDecode(token);
//             console.log('decodedToken:', decodedToken); // Додайте це
//             return decodedToken.exp < Date.now() / 1000;
//         } catch (error) {
//             console.error('Помилка декодування токена:', error);
//             return true; // Якщо токен некоректний, вважаємо його недійсним
//         }
//     };

//     if (isTokenExpired()) {
//         localStorage.removeItem('token'); // Видаляємо прострочений токен
//         return <Navigate to="/login" />;
//     }

//     return children; // Якщо токен валідний, дозволяємо доступ
// };

// export default PrivateRoute;


//client/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1]; // Беремо середню частину
        const decodedPayload = atob(payload); // Декодуємо з Base64
        return JSON.parse(decodedPayload); // Парсимо JSON
    } catch (error) {
        console.error('Помилка декодування токена:', error);
        return null;
    }
};

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    const isTokenExpired = () => {
        if (!token) return true;

        const decodedToken = decodeToken(token);
        if (!decodedToken) return true;

        return decodedToken.exp < Date.now() / 1000;
    };

    if (isTokenExpired()) {
        localStorage.removeItem('token'); // Видаляємо прострочений токен
        return <Navigate to="/login" />;
    }

    return children; // Якщо токен валідний, дозволяємо доступ
};

export default PrivateRoute;
