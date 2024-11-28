
// client/src/components/FinanceModule.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const FinanceModule = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCollectionPurpose, setNewCollectionPurpose] = useState('');
  const [newCollectionAmount, setNewCollectionAmount] = useState('');


  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/finance/active-collections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (token) {
          const decoded = jwtDecode(token);
          console.log(token)
          const role = decoded.role || 'user';
          setUserRole(role); // Оновлюємо стан ролі
      }
        setCollections(response.data.collections || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Не вдалося завантажити дані зборів.');
        setLoading(false);
      }
    };

    fetchCollections();
  }, [token]);

  const handlePayment = async (collectionPurpose, amount) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payments/create',
        {
          amount,
          description: `Оплата за ${collectionPurpose}`,
          purpose: collectionPurpose,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Payment creation response:', response.data);
      const { orderId, data, signature, url } = response.data;
      const form = document.createElement('form');
      form.action = url;
      form.method = 'POST';
      form.target = '_blank';
      form.innerHTML = `
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
      `;
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      let attemptCount = 0; // Лічильник спроб
      const interval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `http://localhost:5000/api/payments/status/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log('Payment status response:', statusResponse.data);

          if (statusResponse.data.response.status === 'success' || statusResponse.data.response.status === 'sandbox') {
            clearInterval(interval);
            console.log('Payment completed successfully');
          } else {
            attemptCount++;
            if (attemptCount >= 10) {
              clearInterval(interval);
              console.log('Time for payment has passed, try again.');
              alert('Час на оплату пройшов, спробуйте ще раз.');
            }
          }
        } catch (error) {
          console.error('Error fetching payment status:', error.message);
        }
      }, 60000);
    } catch (err) {
      console.error('Error initiating payment:', err);
      alert('Помилка створення платежу. Спробуйте ще раз.');
    }
  };

  const openModal = (collection) => {
    setSelectedCollection(collection);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCollection(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateCollection = async () => {
    try {
      console.log('Collection data:', { newCollectionPurpose , newCollectionAmount });
      const response = await axios.post(
        'http://localhost:5000/api/statistics/create-collection',
        {
          purpose: newCollectionPurpose,
          totalAmount: newCollectionAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Collection created successfully:', response.data);
      setIsCreateModalOpen(false);
      setNewCollectionPurpose('');
      setNewCollectionAmount('');
      setCollections([...collections, response.data.newStatistic]);
    } catch (error) {
      console.error('Error creating collection:', error.message);
      alert('Не удалось создать сбор. Попробуйте снова.');
    }
  };

  if (loading) return <p>Завантаження даних...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="finance-module">
        {/* {<div>{console.log(userRole)}</div>} */}
        {userRole === 'admin' && (
        <button className="create-collection-button" onClick={openCreateModal}>
          +
        </button>
      )}

      {collections.length === 0 ? (
        <p className="no-collections-message">Наразі немає активних зборів.</p>
      ) : (
        collections.map((collection, index) => (
          <div key={index} className="collection">
            <h3 className="collection-title">{collection.purpose}</h3>
            <p className="collection-total">Загальна сума: {collection.totalAmount} грн</p>
            <p className="collection-collected">Зібрано: {collection.collectedAmount} грн</p>
            <p className="collection-debt">Борг: {collection.debt} грн</p>

            {/* Шкала заповнення */}
            <div className="progress-bar">
              <div
                className="progress-bar-filled"
                style={{ width: `${(collection.collectedAmount / collection.totalAmount) * 100}%` }}
              >
                {collection.collectedAmount > 0 && (
                <span className="progress-text">
                {Math.min(((collection.collectedAmount / collection.totalAmount) * 100).toFixed(2), 100)}%
                </span>
                )}
              </div>
            </div>


            {collection.userPayment ? (
              <>
                {/* Відображення, якщо користувач уже заплатив */}
                {collection.userPayment.paid > 0 && (
                  <p className="user-payment-paid">Ваш платіж: {collection.userPayment.paid} грн</p>
                )}
                {collection.userPayment.remaining > 0 && (
                  <div>
                  <p className="user-payment-remaining">Ваш залишок: {collection.userPayment.remaining} грн</p>
                  <button
                    className="payment-button"
                    onClick={() =>
                      handlePayment(collection.purpose, collection.userPayment.remaining)
                    }
                  >
                    Сплатити
                  </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {userRole === 'admin' ? (
                  <button className="details-button" onClick={() => openModal(collection)}>Деталі внесків</button>
                ) : (
                  <div className="scrollable-table-container">
                  <table className="contributions-table">
                    <thead>
                      <tr className="contributions-table-header">
                        <th>Користувач</th>
                        <th>Квартира</th>
                        <th>Площа</th>
                        <th>Внесок</th>
                        <th>Сплачено</th>
                        <th>Залишок</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collection.contributions.map((contribution, i) => (
                        <tr key={i} className="contributions-row">
                          <td>{contribution.name}</td>
                          <td>{contribution.apartmentNumber}</td>
                          <td>{contribution.area} м²</td>
                          <td>{contribution.requiredContribution} грн</td>
                          <td>{contribution.paid} грн</td>
                          <td>{contribution.remaining} грн</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}

      {showModal && selectedCollection && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h3>Деталі внесків: {selectedCollection.purpose}</h3>
            <div className="scrollable-table-container">
              <table className="contributions-table">
                <thead>
                  <tr className="contributions-table-header">
                    <th>Користувач</th>
                    <th>Квартира</th>
                    <th>Площа</th>
                    <th>Внесок</th>
                    <th>Сплачено</th>
                    <th>Залишок</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCollection.contributions.map((contribution, i) => (
                    <tr key={i} className="contributions-row">
                      <td>{contribution.name}</td>
                      <td>{contribution.apartmentNumber}</td>
                      <td>{contribution.area} м²</td>
                      <td>{contribution.requiredContribution} грн</td>
                      <td>{contribution.paid} грн</td>
                      <td>{contribution.remaining} грн</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="modal-button" onClick={closeModal}>Закрити</button>
          </div>
        </div>
      )}


        {isCreateModalOpen && (
          <div className="new-payment-modal" onClick={closeCreateModal}>
            <div className="new-payment-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Хрестик для закриття */}
              <span className="new-payment-close-button" onClick={closeCreateModal}>x</span>
              <h3 className="new-payment-header">Створення нового внеску</h3>
              <label className="new-payment-label">
                Призначення збору:
                <input
                  className="new-payment-modal-input"
                  type="text"
                  value={newCollectionPurpose}
                  onChange={(e) => setNewCollectionPurpose(e.target.value)}
                />
              </label>
              <label>
                Загальна сума збору (грн.):
                <input
                  className="new-payment-modal-input"
                  type="number"
                  value={newCollectionAmount}
                  onChange={(e) => setNewCollectionAmount(e.target.value)}
                />
              </label>
              <button className="new-payment-create-button" onClick={handleCreateCollection}>Створити</button>
            </div>
          </div>
        )}




    </div>
  );
};

export default FinanceModule;
