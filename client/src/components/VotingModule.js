
//client/src/components/VotingModule.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VotingModule = () => {
    const [currentVote, setCurrentVote] = useState(null);
    const [history, setHistory] = useState([]);

    // Отримання поточного голосування
    const fetchCurrentVote = async () => {
        try {
            const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
            const response = await axios.get('http://localhost:5000/api/votes/current', {
                headers: {
                    Authorization: `Bearer ${token}`, // Передаємо токен у заголовку
                },
            });
            setCurrentVote(response.data);
        } catch (error) {
            console.error("Ошибка при получении текущего голосования", error);
        }
    };

    // Отримання історії голосувань
    const fetchVoteHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/votes/history', {
                headers: {
                    Authorization: `Bearer ${token}`, // Передаємо токен у заголовку
                },
            });
            setHistory(response.data);
        } catch (error) {
            console.error("Ошибка при получении истории голосований", error);
        }
    };

    // Відправлення голосу
    const handleVote = async (option) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Отправка голосования:', { voteId: currentVote._id, option });////////////////////////////////////////////////////////////////////////log

            const response = await axios.post(
                'http://localhost:5000/api/votes/vote',
                { voteId: currentVote._id, option }, // Передаємо voteId та обраний варіант
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Передаємо токен у заголовку
                    },
                }
            );
            console.log('Голос принят:', response.data);
            fetchCurrentVote(); // Оновлюємо поточне голосування
        } catch (error) {
            console.error("Ошибка при отправке голоса", error);
        }
    };
    

    // Викликаємо функції для отримання даних при завантаженні компонента
    useEffect(() => {
        fetchCurrentVote();
        fetchVoteHistory();
    }, []);

    return (
        <div className="voting-module">
            <div>
                <h2>Поточне голосування</h2>
                {currentVote ? (
                    <div>
                        <p>{currentVote.question}</p>
                        <button onClick={() => handleVote('yes')}>Так</button>
                        <button onClick={() => handleVote('no')}>Ні</button>
                    </div>
                ) : (
                    <p>Завантаження...</p>
                )}
            </div>
            <div>
                <h2>Історія голосувань</h2>
                {history.length > 0 ? (
                    <ul>
                        {history.map((vote, index) => (
                            <li key={index}>
                                <p><strong>{vote.question}</strong></p>
                                <p>Голосування завершено: {vote.result}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Історія голосувань порожня.</p>
                )}
            </div>
        </div>
    );
};

export default VotingModule;
