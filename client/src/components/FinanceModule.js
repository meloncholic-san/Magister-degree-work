
// client/src/components/FinanceModule.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const token = localStorage.getItem('token');
console.log(localStorage.getItem('token'));
const FinanceModule = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Отримати активні збори при завантаженні компонента
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/finance/active-collections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCollections(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Не вдалося завантажити дані зборів.');
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handlePayment = async (collectionPurpose, amount, userId) => {
    console.log("Параметры для платежа:");
    console.log("Ціль збору (collectionPurpose):", collectionPurpose);
    console.log("Сума (amount):", amount);
    console.log("ID користувача (userId):", userId);

    try {

    
        const response = await axios.post('http://localhost:5000/api/payments/create', 
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
      console.log("Payment created:", response.data);
      // Переходимо на сторінку LiqPay для оплати
      const { data, signature, url } = response.data;
      const form = document.createElement('form');
      form.action = url;
      form.method = 'POST';
      form.innerHTML = `
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
      `;
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (err) {
      console.error('Error initiating payment:', err);
      alert('Помилка створення платежу. Спробуйте ще раз.');
    }
  };

  if (loading) return <p>Завантаження даних...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="finance-module">
      <h2>Фінансовий модуль</h2>
      {collections.length === 0 ? (
        <p>Наразі немає активних зборів.</p>
      ) : (
        collections.map((collection, index) => (
          <div key={index} className="collection">
            <h3>{collection.purpose}</h3>
            <p>Загальна сума: {collection.totalAmount} грн</p>
            <p>Зібрано: {collection.collectedAmount} грн</p>
            <p>Борг: {collection.debt} грн</p>
            <h4>Деталі внесків:</h4>
            <table>
              <thead>
                <tr>
                  <th>Користувач</th>
                  <th>Квартира</th>
                  <th>Площа</th>
                  <th>Внесок</th>
                  <th>Сплачено</th>
                  <th>Залишок</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {collection.contributions.map((contribution, i) => (
                  <tr key={i}>
                    <td>{contribution.name}</td>
                    <td>{contribution.apartmentNumber}</td>
                    <td>{contribution.area} м²</td>
                    <td>{contribution.requiredContribution} грн</td>
                    <td>{contribution.paid} грн</td>
                    <td>{contribution.remaining} грн</td>
                    <td>
                      {contribution.remaining > 0 && (
                        <button
                          onClick={() =>
                            handlePayment(collection.purpose, contribution.remaining, contribution.userId)
                          }
                        >
                          Оплатити
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default FinanceModule;