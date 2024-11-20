// client/src/components/VotingModule.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VotingModule = () => {
  const [currentVote, setCurrentVote] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedVoteDetails, setSelectedVoteDetails] = useState(null);
  const [voters, setVoters] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // Fetch current voting
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
      console.error('Ошибка при получении текущего голосования', error);
    }
  };

  // Fetch vote history
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
      console.error('Ошибка при получении истории голосований', error);
    }
  };

  // Handle voting
  const handleVote = async (option) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/votes/vote',
        { voteId: currentVote._id, option },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCurrentVote();
    } catch (error) {
      console.error('Ошибка при отправке голоса', error);
    }
  };

  // Fetch voter details for a vote
  const fetchVoterDetails = async (voteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/votes/${voteId}/voters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVoters(response.data);
      setSelectedVoteDetails(voteId);
    } catch (error) {
      console.error('Ошибка при получении данных о проголосовавших:', error);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedVoteDetails(null);
    setVoters([]);
  };

  // Get vote percentage
  const getVotePercentage = (votes, option) => {
    const totalVotes = votes.length;
    const optionVotes = votes.filter((vote) => vote.option === option).length;
    return totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;
  };

  // Decode token and set user role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  // Fetch votes on component mount
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
            {currentVote.status === 'active' && (
              <div className="vote-container">
                <div className="vote-bar">
                  <div
                    className="vote-option yes"
                    style={{ width: `${getVotePercentage(currentVote.votes, 'yes')}%` }}
                  >
                    {getVotePercentage(currentVote.votes, 'yes') > 0 &&
                      `${getVotePercentage(currentVote.votes, 'yes').toFixed(1)}%`}
                  </div>
                  <div
                    className="vote-option no"
                    style={{ width: `${getVotePercentage(currentVote.votes, 'no')}%` }}
                  >
                    {getVotePercentage(currentVote.votes, 'no') > 0 &&
                      `${getVotePercentage(currentVote.votes, 'no').toFixed(1)}%`}
                  </div>
                </div>
              </div>
            )}
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
                <p>
                  Голосування завершено: Так - {vote.yesVotes}, Ні - {vote.noVotes}, Всього - {vote.totalVotes}
                </p>
                <div className="vote-container">
                  <div className="vote-bar">
                    <div
                      className="vote-option yes"
                      style={{
                        width: `${(vote.yesVotes / vote.totalVotes) * 100}%`,
                      }}
                    >
                      {(vote.yesVotes / vote.totalVotes) * 100 > 0 &&
                        `${((vote.yesVotes / vote.totalVotes) * 100).toFixed(1)}%`}
                    </div>
                    <div
                      className="vote-option no"
                      style={{
                        width: `${(vote.noVotes / vote.totalVotes) * 100}%`,
                      }}
                    >
                      {(vote.noVotes / vote.totalVotes) * 100 > 0 &&
                        `${((vote.noVotes / vote.totalVotes) * 100).toFixed(1)}%`}
                    </div>
                  </div>
                </div>
                {userRole === 'admin' && (
                  <button onClick={() => fetchVoterDetails(vote._id)}>Детали голосования</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Історія голосувань порожня.</p>
        )}
      </div>

      {selectedVoteDetails && (
        <div className="modal">
          <div className="modal-content">
            <h2>Детали голосования</h2>
            <button className="close-button" onClick={closeModal}>
              Закрыть
            </button>
            <ul>
              {voters.map((voter, index) => (
                <li key={index}>
                  {voter.firstName} {voter.lastName} (Квартира: {voter.apartmentNumber}) проголосовал за: {voter.option === 'yes' ? 'Да' : 'Нет'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingModule;
