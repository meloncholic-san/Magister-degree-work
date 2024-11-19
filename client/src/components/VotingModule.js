// client/src/components/VotingModule.js
// client/src/components/VotingModule.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VotingModule = () => {
  const [currentVote, setCurrentVote] = useState(null);
  const [history, setHistory] = useState([]);

  // Функция для получения текущего голосования
  const fetchCurrentVote = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/votes/current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentVote(response.data);
    } catch (error) {
      console.error("Ошибка при получении текущего голосования", error);
    }
  };

  // Функция для получения истории голосований
  const fetchVoteHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/votes/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Ошибка при получении истории голосований", error);
    }
  };

  // Функция для отправки голоса
  const handleVote = async (option) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/votes/vote',
        { voteId: currentVote._id, option },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Голос принят:', response.data);
      fetchCurrentVote(); // Обновляем текущие данные о голосовании
    } catch (error) {
      console.error("Ошибка при отправке голоса", error);
    }
  };

  // Вычисление процентного соотношения голосов
  const getVotePercentage = (votes, option) => {
    const totalVotes = votes.length;
    const optionVotes = votes.filter(vote => vote.option === option).length;
    return totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;
  };

  // Вызываем функции для загрузки данных при монтировании компонента
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
            <div className="vote-container">
              <div 
                className="vote-option yes"
                style={{ width: `${getVotePercentage(currentVote.votes, 'yes')}%` }}
              ></div>
              <div 
                className="vote-option no"
                style={{ width: `${getVotePercentage(currentVote.votes, 'no')}%` }}
              ></div>
            </div>
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
                <p>Голосування завершено: Так - {vote.yesVotes}, Ні - {vote.noVotes}, Всего - {vote.totalVotes}</p>
                <div className="vote-container">
                  <div 
                    className="vote-option yes"
                    style={{ width: `${(vote.yesVotes / vote.totalVotes) * 100}%` }}
                  ></div>
                  <div 
                    className="vote-option no"
                    style={{ width: `${(vote.noVotes / vote.totalVotes) * 100}%` }}
                  ></div>
                </div>
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
