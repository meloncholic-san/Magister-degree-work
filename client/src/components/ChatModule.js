
// client/src/components/ChatModule.js

import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";

const ChatModule = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [page, setPage] = useState(1); 
    const messagesEndRef = useRef(null); 
    const containerRef = useRef(null); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser({
                id: decoded.id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: decoded.role,
            });
        }

        const fetchMessages = async () => {
            try {
                const limit = 10;
                const response = await fetch(`http://localhost:5000/api/messages?page=${page}&limit=${limit}`);
                const data = await response.json();
                setMessages((prevMessages) => [...prevMessages, ...data]);
            } catch (error) {
                console.error('Ошибка при загрузке сообщений:', error);
            }
        };

        fetchMessages();
    }, [page]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Додавання обробника прокручування
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                const scrollHeight = containerRef.current.scrollHeight;
                const clientHeight = containerRef.current.clientHeight;

                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    // Завантаження нових повідомлень, якщо користувач досягнув нижньої частини
                    setPage((prevPage) => prevPage + 1);
                }
            }
        };

        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);

        // Очищення обробника при демонтажі компонента
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
            } else {
                console.error('Ошибка при удалении сообщения');
            }
        } catch (error) {
            console.error('Ошибка при удалении сообщения:', error);
        }
    };

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
                setMessages((prevMessages) => [...prevMessages, newMessage]);
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

            <div className="messages-container" ref={containerRef}>
                {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg._id} className="message">
                            <div className="message-header">
                                <strong>
                                    {msg.user?.firstName} {msg.user?.lastName} (Квартира {msg.user?.apartment}):
                                </strong>
                                {(msg.user?.firstName === user?.firstName && msg.user?.lastName === user?.lastName) || 
                                 ['admin', 'super-user'].includes(user?.role) ? (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(msg._id)}
                                        title="Видалити повідомлення"
                                    >
                                        🗑️
                                    </button>
                                ) : null}
                            </div>
                            <p>{msg.text}</p>
                            <span>
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Нет даты'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>Сообщений нет</p>
                )}
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
