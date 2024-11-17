// client/src/components/LoginForm.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginForm = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//     });
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch('http://localhost:5000/api/users/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 alert('Вхід успішний');
//                 navigate('/'); // Перенаправлення на головну сторінку після успішного входу
//             } else {
//                 alert(`Помилка: ${data.message}`);
//             }
//         } catch (error) {
//             console.error('Помилка входу:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Вхід</h2>
//             <div>
//                 <label>Логін</label>
//                 <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div>
//                 <label>Пароль</label>
//                 <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <button type="submit">Увійти</button>
//         </form>
//     );
// };

// export default LoginForm;


// // client/src/components/LoginForm.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginForm = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//     });
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(''); // Очищення повідомлення про помилку перед новим запитом

//         try {
//             const response = await fetch('http://localhost:5000/api/users/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 alert('Вхід успішний');
//                 navigate('/'); // Перенаправлення на головну сторінку після успішного входу
//             } else {
//                 setError(data.message || 'Помилка входу');
//             }
//         } catch (error) {
//             console.error('Помилка входу:', error);
//             setError('Не вдалося з’єднатися із сервером');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Вхід</h2>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <div>
//                 <label>Логін</label>
//                 <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div>
//                 <label>Пароль</label>
//                 <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <button type="submit">Увійти</button>
//         </form>
//     );
// };

// export default LoginForm;

// client/src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Очищення повідомлення про помилку перед новим запитом

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            // if (response.ok) {
            //     alert('Вхід успішний');
            //     // Зберігаємо токен в localStorage
            //     localStorage.setItem('token', data.token);
            //     navigate('/'); // Перенаправлення на головну сторінку після успішного входу
            // } 
            if (response.ok) {
                alert('Вхід успішний');
                // Зберігаємо токен в localStorage
                localStorage.setItem('token', data.token);
            
                // Декодуємо токен для отримання імені та прізвища
                const decoded = jwtDecode(data.token);
                console.log(`Вітаємо, ${decoded.firstName} ${decoded.lastName}!`);
            
                navigate('/'); // Перенаправлення на головну сторінку
            }
            
            
            else {
                setError(data.message || 'Помилка входу');
            }
        } catch (error) {
            console.error('Помилка входу:', error);
            setError('Не вдалося з’єднатися із сервером');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вхід</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Логін</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Пароль</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Увійти</button>
        </form>
    );
};

export default LoginForm;
