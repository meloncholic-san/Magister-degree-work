// // client/src/components/VotingModule.js



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [remainingTime, setRemainingTime] = useState(null);

   // Функція для обчислення часу до завершення
   const calculateRemainingTime = (expiresAt) => {
    const now = Date.now();
    const expirationTime = new Date(expiresAt).getTime();
    const timeDiff = expirationTime - now; // Різниця в мілісекундах

    return timeDiff > 0 ? Math.ceil(timeDiff / 1000) : 0; // Повертає секунди або 0
  };

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

            // Початкове обчислення залишкового часу
            if (response.data?.expiresAt) {
              const timeLeft = calculateRemainingTime(response.data.expiresAt);
              setRemainingTime(timeLeft);
            }

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
      // Оновлюємо локальний стан
      setCurrentVote(null);
      // Оновлюємо історію голосувань
      fetchVoteHistory();

      toast.success('Голосування успішно завершено!'); // Успішне сповіщення
      fetchCurrentVote(); // Reload current vote
    } catch (error) {
      console.error('Ошибка при завершении голосования', error);
      toast.error('Сталася помилка при завершенні голосування.'); // Помилка
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

      // Використання таймера для оновлення залишкового часу
      useEffect(() => {
        let timer;
    
        if (currentVote?.expiresAt) {
          // Запуск інтервалу
          timer = setInterval(() => {
            const timeLeft = calculateRemainingTime(currentVote.expiresAt);
            setRemainingTime(timeLeft);
    
            if (timeLeft <= 0) {
              clearInterval(timer); // Зупинка таймера, якщо час вийшов
            }
          }, 1000); // Оновлення кожну секунду
        }
    
        // Очищення інтервалу при демонтажі компонента
        return () => clearInterval(timer);
      }, [currentVote]);
    


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
           {remainingTime !== null && (
  <div className="timer">
    Залишилося часу: {" "}  
    {Math.floor(remainingTime / 86400) > 0 && (
      <>
        {Math.floor(remainingTime / 86400)} дн{"  "}
      </>
    )}
    {Math.floor((remainingTime % 86400) / 3600) > 0 && (
      <>
        {Math.floor((remainingTime % 86400) / 3600)} год{" "}
      </>
    )}
    {Math.floor((remainingTime % 3600) / 60)} хв {remainingTime % 60} сек
  </div>
)}
      <p className="vote-question" >{currentVote.question}</p>
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
      <div className="button-grid">
        {currentVote.options.map((option, index) => (
        <button
          className="button-option"
          key={index}
          style={{
            backgroundColor: voteBarColors[index % voteBarColors.length], // Призначаємо колір із масиву
          }}
          onClick={() => handleVote(option)}
        >
          {option}
        </button>
      ))}
      </div>

      {/* Admin Button to Complete Vote */}
      {userRole === 'admin' && (
        <button 
        className="admin-button"
        onClick={() => completeCurrentVote(currentVote._id)}>
          Завершити голосування
        </button>
      )}

    </div>
  ) : (
    <div>
      <p className="empty-vote-phrase" >Наразі немає активних голосувань</p>
      
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
      <h3 className="new-vote-header" >Створити нове голосування</h3>
      <input
        className="new-vote-name"
        type="text"
        placeholder="Введіть питання голосування"
        value={newVoteQuestion}
        onChange={(e) => setNewVoteQuestion(e.target.value)}
      />
      {newVoteOptions.map((option, index) => (
        <div className="new-vote-option-container" key={index}>
          <input
            className="new-vote-option"
            type="text"
            placeholder={`Опція ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e)}
          />
          <button 
           className="new-vote-option-delete"
           onClick={() => handleRemoveOption(index)}>Видалити</button>
        </div>
      ))}
      <button
      className="new-vote-option-create"
       onClick={handleAddOption}>Додати опцію</button>

{/* Поле для задания таймера */}
<div>
    <label className="new-vote-timer-header">
      Ви хочете створити таймер для голосування?
      <input className="new-vote-timer-chechbox"
        type="checkbox"
        checked={!!durationHours}
        onChange={(e) => setDurationHours(e.target.checked ? 1 : null)} // Таймер на 1 час по умолчанию
      />
    </label>
    {durationHours && (
      <div className="new-vote-timer-container">
      <span className="new-vote-timer-label">Введіть кількість годин</span>
      <input
        className="new-vote-timer-duration"
        type="number"
        placeholder="Вкажіть години"
        value={durationHours}
        onChange={(e) => setDurationHours(Number(e.target.value))}
      />
    </div>
    )}
  </div>

      <button className="new-vote-button-create" onClick={handleCreateVote}>Створити голосування</button>
    </div>
  </div>
)}


      {/* Vote History Section */}
      <div>
        <h2>Історія голосувань</h2>
        {history.length > 0 ? (
           <div className="history-container">
            <ul>
              {history
              .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Сортуємо за датою завершення
              .map((vote, index) => (
                <li key={index} className="history-item">
                  <p className="vote-question">{vote.question}</p>
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
                  <button className= "vote-history-details-button" onClick={() => fetchVoterDetails(vote._id)}>Переглянути деталі голосування</button>
                </li>
              ))}
            </ul>
          </div>
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

    <ToastContainer />
    </div>
  );

};

export default VotingModule;
