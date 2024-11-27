
// client/src/components/FinanceModule.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinanceModule = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/finance/active-collections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Витягуємо роль із відповіді сервера (якщо доступна)
        const role = response.data.role || 'user';
        setUserRole(role);

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
          // Log the entire response from the server
      console.log('Payment creation response:', response.data);
      const { orderId, data, signature, url } = response.data;
      const form = document.createElement('form');
      form.action = url;
      form.method = 'POST';
      form.target = '_blank'; // Открывает форму в новом окне/вкладке
      form.innerHTML = `
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
      `;
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    
    
    
    // Периодическая проверка статуса платежа
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

        // Если статус успешен, останавливаем интервал
        if (statusResponse.data.response.status === 'success' || statusResponse.data.response.status === 'sandbox') {
          clearInterval(interval);
          console.log('Payment completed successfully');
        }
      } catch (error) {
        console.error('Error fetching payment status:', error.message);
        // Здесь можно добавить обработку ошибок, если необходимо
      }
    }, 60000); // 60000 мс = 1 минута
    
    
    
    } catch (err) {
      console.error('Error initiating payment:', err);
      alert('Помилка створення платежу. Спробуйте ще раз.');
    }
  };

  if (loading) return <p>Завантаження даних...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="finance-module">
      {collections.length === 0 ? (
        <p className="no-collections-message">Наразі немає активних зборів.</p>
      ) : (
        collections.map((collection, index) => (
          <div key={index} className="collection">
            <h3 className="collection-title">{collection.purpose}</h3>
            <p className="collection-total">Загальна сума: {collection.totalAmount} грн</p>
            <p className="collection-collected">Зібрано: {collection.collectedAmount} грн</p>
            <p className="collection-debt">Борг: {collection.debt} грн</p>
            {collection.userPayment ? (
              <>
                <p className="user-payment-paid">Ваш платіж: {collection.userPayment.paid} грн</p>
                <p className="user-payment-remaining">Ваш залишок: {collection.userPayment.remaining} грн</p>
                {collection.userPayment.remaining > 0 && (
                  <button
                    className="payment-button"
                    onClick={() =>
                      handlePayment(collection.purpose, collection.userPayment.remaining)
                    }
                  >
                    Оплатити
                  </button>
                )}
              </>
            ) : (
              <>
                <h4 className="contributions-header">Деталі внесків:</h4>
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
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
  

};

export default FinanceModule;
