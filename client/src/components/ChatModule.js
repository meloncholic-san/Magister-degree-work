//client/src/components/ChatModule.js
// import React, { useState, useEffect } from 'react';

// const ChatModule = () => {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/messages');
//                 const data = await response.json();
//                 setMessages(data);
//             } catch (error) {
//                 console.error('Помилка завантаження повідомлень:', error);
//             }
//         };

//         fetchMessages();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!message.trim()) return;

//         try {
//             const response = await fetch('http://localhost:5000/api/messages', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ text: message }),
//             });

//             if (response.ok) {
//                 const newMessage = await response.json();
//                 setMessages([...messages, newMessage]);
//                 setMessage('');
//             }
//         } catch (error) {
//             console.error('Помилка відправки повідомлення:', error);
//         }
//     };

//     return (
//         <div className="chat-container">
//             <div className="messages-container">
//                 {messages.map((msg, index) => (
//                     <div key={index} className="message">
//                         {msg.text}
//                     </div>
//                 ))}
//             </div>
//             <form onSubmit={handleSubmit} className="form">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Напишіть повідомлення..."
//                     className="input"
//                 />
//                 <button type="submit" className="button">
//                     Надіслати
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ChatModule;

//client/src/components/ChatModule.js
// import React, { useState, useEffect } from 'react';
// import { jwtDecode } from "jwt-decode";


// const ChatModule = () => {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         // Декодуємо токен, щоб отримати дані користувача
//         const token = localStorage.getItem('token');
//         if (token) {
//             const decoded = jwtDecode(token);
//             setUser({ firstName: decoded.firstName, lastName: decoded.lastName });
//         }

//         const fetchMessages = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/messages');
//                 const data = await response.json();
//                 setMessages(data);
//             } catch (error) {
//                 console.error('Помилка завантаження повідомлень:', error);
//             }
//         };

//         fetchMessages();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!message.trim()) return;

//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch('http://localhost:5000/api/messages', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ text: message }),
//             });

//             if (response.ok) {
//                 const newMessage = await response.json();
//                 setMessages([...messages, newMessage]);
//                 setMessage('');
//             }
//         } catch (error) {
//             console.error('Помилка відправки повідомлення:', error);
//         }
//     };

//     return (
//         <div className="chat-container">
//             <h2>Чат</h2>
//             {user && <p>Ласкаво просимо, {user.firstName} {user.lastName}!</p>}
//             {/* <div className="messages-container">
//                 {messages.map((msg, index) => (
//                     <div key={index} className="message">
//                         {msg.text}
//                     </div>
//                 ))}
//             </div> */}
            

//             <div className="messages-container">
//     {messages && messages.length > 0 ? (
//         messages.map((msg, index) => (
//             <div key={index} className="message">
//                 <p>
//                     <strong>
//                         {msg.user?.firstName} {msg.user?.lastName} (Квартира {msg.user?.apartment}):
//                     </strong>
//                 </p>
//                 <p>{msg.text}</p>
//                 <span>
//                     {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Нет даты'}
//                 </span>
//             </div>
//         ))
//     ) : (
//         <p>Сообщений нет</p>
//     )}
// </div>


            {/* <div className="messages-container">
    {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
            <div key={index} className="message">
                <p><strong>{msg.user?.firstName} {msg.user?.lastName} (Квартира {msg.user?.apartment}):</strong></p>
                <p>{msg.text}</p>
                <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Нет даты'}</span>
            </div>
        ))
    ) : (
        <p>Сообщений нет</p>
    )}
</div> */}

            {/* <div className="messages-container">
    {messages.map((msg, index) => (
        <div key={index} className="message">
            <p><strong>{msg.user.firstName} {msg.user.lastName} (Квартира {msg.user.apartment}):</strong></p>
            <p>{msg.text}</p>
            <span>{new Date(msg.createdAt).toLocaleString()}</span>
        </div>
    ))}
</div> */}

//             <form onSubmit={handleSubmit} className="form">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Напишіть повідомлення..."
//                     className="input"
//                 />
//                 <button type="submit" className="button">
//                     Надіслати
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ChatModule;










//client/src/components/ChatModule.js
import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";

const ChatModule = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null); // Реф для прокрутки

    // Прокручиваем к последнему сообщению
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        // Декодируем токен, чтобы получить данные пользователя
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser({ firstName: decoded.firstName, lastName: decoded.lastName });
        }

        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/messages');
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Ошибка при загрузке сообщений:', error);
            }
        };

        fetchMessages();
    }, []);

    useEffect(() => {
        // Прокручиваем вниз, когда сообщения обновляются
        scrollToBottom();
    }, [messages]); // Этот useEffect сработает, когда изменятся сообщения

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: message }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, newMessage]); // Добавляем новое сообщение в конец
                setMessage('');
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
    };

    return (
        <div className="chat-container">
            <h2>Чат</h2>
            {user && <p>Ласкаво просимо, {user.firstName} {user.lastName}!</p>}

            <div className="messages-container">
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className="message">
                            <p>
                                <strong>
                                    {msg.user?.firstName} {msg.user?.lastName} (Квартира {msg.user?.apartment}):
                                </strong>
                            </p>
                            <p>{msg.text}</p>
                            <span>
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Нет даты'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>Сообщений нет</p>
                )}
                {/* Этот div будет использоваться для прокрутки */}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Напишіть повідомлення..."
                    className="input"
                />
                <button type="submit" className="button">
                    Надіслати
                </button>
            </form>
        </div>
    );
};

export default ChatModule;
