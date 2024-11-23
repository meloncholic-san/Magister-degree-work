// // client/src/components/VotingModule.js



import React, { useState, useEffect } from 'react';
import axios from 'axios';


const voteBarColors = [
  '#1E90FF', // DodgerBlue
  '#FF4500', // OrangeRed
  '#FFD700', // Gold
  '#800080', // Purple
  '#32CD32', // LimeGreen
  '#FF69B4', // HotPink
  '#00CED1', // DarkTurquoise
  '#8A2BE2', // BlueViolet
  '#FF6347', // Tomato
  '#4682B4', // SteelBlue
];


const VotingModule = () => {
  const [currentVote, setCurrentVote] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedVoteDetails, setSelectedVoteDetails] = useState(null);
  const [voters, setVoters] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [newVoteQuestion, setNewVoteQuestion] = useState('');
  const [newVoteOptions, setNewVoteOptions] = useState(['']);
  const [isCreateVoteModalOpen, setIsCreateVoteModalOpen] = useState(false);
  const [durationHours, setDurationHours] = useState(null); 


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
      console.error('Ошибка при получении истории голосувань', error);
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

  // Complete current vote
  const completeCurrentVote = async (voteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/votes/complete',
        { voteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCurrentVote(); // Reload current vote
    } catch (error) {
      console.error('Ошибка при завершении голосования', error);
    }
  };

  // Create new vote
  const handleCreateVote = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/votes/create',
        { question: newVoteQuestion, options: newVoteOptions, durationHours },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewVoteQuestion('');
      setNewVoteOptions(['']);
      fetchCurrentVote();
      setDurationHours(null);
      alert('Голосування створено!');
    } catch (error) {
      console.error('Ошибка при создании голосования', error);
      alert('Не вдалося створити голосування.');
    }
  };

  //Handle Modal Openings
  const openCreateVoteModal = () => {
    setIsCreateVoteModalOpen(true);
  };
  
  const closeCreateVoteModal = () => {
    setIsCreateVoteModalOpen(false);
  };
  


  // Handle input change for options
  const handleOptionChange = (index, event) => {
    const updatedOptions = [...newVoteOptions];
    updatedOptions[index] = event.target.value;
    setNewVoteOptions(updatedOptions);
  };

  // Add new option input
  const handleAddOption = () => {
    setNewVoteOptions([...newVoteOptions, '']);
  };

  // Remove option input
  const handleRemoveOption = (index) => {
    const updatedOptions = newVoteOptions.filter((_, i) => i !== index);
    setNewVoteOptions(updatedOptions);
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

  // Get vote percentage for each option
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
 {/* Current Vote Section */}
<div>
  <h2>Поточне голосування</h2>
  {currentVote ? (
    
    <div>
            {currentVote?.expiresAt && (
        <div className="timer">
          Голосування закінчиться через: {Math.max(0, Math.ceil((new Date(currentVote.expiresAt) - Date.now()) / 1000 / 60))} хвилин
        </div>
      )}
      <p>{currentVote.question}</p>
      <div className="vote-container">
        <div className="vote-bar">
          
          {currentVote.options.map((option, index) => {
            const percentage = getVotePercentage(currentVote.votes, option);

            return (
              <div
                key={index}
                className={`vote-option`}
                style={{ backgroundColor: voteBarColors[index % voteBarColors.length], width: `${percentage}%` }}
              >
                {percentage > 0 && (
                  <span className="vote-text">
                    {option} - {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {currentVote.options.map((option, index) => (
        <button key={index} onClick={() => handleVote(option)}>
          {option}
        </button>
      ))}

      {/* Admin Button to Complete Vote */}
      {userRole === 'admin' && (
        <button onClick={() => completeCurrentVote(currentVote._id)}>
          Завершити голосування
        </button>
      )}

    </div>
  ) : (
    <div>


      <p>Наразі немає активних голосувань</p>
      
            {/* Admin Button to Create New Vote (opens Modal) */}
      {userRole === 'admin' && (
        <button className="create-vote-btn" onClick={openCreateVoteModal}>
          +
        </button>
      )}
    </div>
  )}

</div>

{/* New Vote Creation Modal */}
{userRole === 'admin' && isCreateVoteModalOpen && (
  <div>
    <div className="modal-backdrop" onClick={closeCreateVoteModal}></div>
    <div className="voter-details-modal">
      <button className="close-button" onClick={closeCreateVoteModal}>×</button>
      <h3>Створити нове голосування</h3>
      <input
        type="text"
        placeholder="Введіть питання голосування"
        value={newVoteQuestion}
        onChange={(e) => setNewVoteQuestion(e.target.value)}
      />
      {newVoteOptions.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Опція ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e)}
          />
          <button onClick={() => handleRemoveOption(index)}>Видалити</button>
        </div>
      ))}
      <button onClick={handleAddOption}>Додати опцію</button>

{/* Поле для задания таймера */}
<div>
    <label>
      Ви хочете створити таймер для голосування?
      <input
        type="checkbox"
        checked={!!durationHours}
        onChange={(e) => setDurationHours(e.target.checked ? 1 : null)} // Таймер на 1 час по умолчанию
      />
    </label>
    {durationHours && (
      <input
        type="number"
        placeholder="Вкажіть години"
        value={durationHours}
        onChange={(e) => setDurationHours(Number(e.target.value))}
      />
    )}
  </div>

      <button onClick={handleCreateVote}>Створити голосування</button>
    </div>
  </div>
)}



      {/* Vote History Section */}
      <div>
        <h2>Історія голосувань</h2>
        {history.length > 0 ? (
          <ul>
            {history.map((vote, index) => (
              <li key={index} className="history-item">
                <p><strong>{vote.question}</strong></p>
                <p>Голосування завершено</p>
                <div className="history-vote-bar">
                  {vote.options.map((option, idx) => {
                    return (
                      <div
                        key={idx}
                        className="history-vote-option"
                        style={{
                          backgroundColor: voteBarColors[idx % voteBarColors.length],
                          width: `${getVotePercentage(vote.votes, option)}%`,
                        }}
                      >
                        {getVotePercentage(vote.votes, option) > 0 && (
                          <span className="history-vote-text">
                            {option} - {getVotePercentage(vote.votes, option).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => fetchVoterDetails(vote._id)}>Переглянути деталі голосування</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Історія порожня.</p>
        )}
      </div>

        {/* Voter Details Modal */}
        {selectedVoteDetails && (
          <div>
            <div className="modal-backdrop" onClick={closeModal}></div>
            <div className="voter-details-modal">
              <button className="close-button" onClick={closeModal}>×</button> {/* Кнопка хрестика */}
              <h3>Проголосували</h3>
              {voters.length > 0 ? (
                <ul>
                  {voters.map((voter, index) => (
                    <li key={index}>
                      {voter.firstName} {voter.lastName} (Квартира: {voter.apartmentNumber}) - {voter.option}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Не проголосували ще.</p>
              )}
            </div>
          </div>
        )}


    </div>
  );
};

export default VotingModule;
