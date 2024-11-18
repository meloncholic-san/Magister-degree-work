
//client/src/components/VotingModule.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Компонент для отображения текущего голосования
const CurrentVote = ({ onVote }) => {
    const [voteData, setVoteData] = useState(null);

    useEffect(() => {
        // Получаем текущее голосование с сервера
        axios.get('http://localhost:5000/api/votes/current')
            .then((response) => {
                setVoteData(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении текущего голосования", error);
            });
    }, []);

    const handleVote = (vote) => {
        onVote(vote); // Отправляем голос родительскому компоненту
    };

    if (!voteData) return <p>Загрузка текущего голосования...</p>;

    return (
        <div>
            <h2>Поточне голосування</h2>
            <p>{voteData.question}</p>
            <button onClick={() => handleVote('yes')}>Так</button>
            <button onClick={() => handleVote('no')}>Ні</button>
        </div>
    );
};

// Компонент для отображения истории голосований
const VoteHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Получаем историю голосований с сервера
        axios.get('http://localhost:5000/api/votes/history')
            .then((response) => {
                setHistory(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении истории голосований", error);
            });
    }, []);

    return (
        <div>
            <h2>Історія голосувань</h2>
            {history.length === 0 ? (
                <p>Історія голосувань порожня.</p>
            ) : (
                <ul>
                    {history.map((vote, index) => (
                        <li key={index}>
                            <p><strong>{vote.question}</strong></p>
                            <p>Голосування завершено: {vote.result}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Основной компонент модуля голосования
const VotingModule = () => {
    const [currentVote, setCurrentVote] = useState(null);

    const handleVote = (vote) => {
        // Отправка голосования на сервер (например, "yes" или "no")
        axios.post('http://localhost:5000/api/votes/vote', { vote })
            .then((response) => {
                console.log('Голос принят:', response.data);
                setCurrentVote(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при отправке голоса", error);
            });
    };

    return (
        <div className="voting-module">
            <CurrentVote onVote={handleVote} />
            <VoteHistory />
        </div>
    );
};

export default VotingModule;
