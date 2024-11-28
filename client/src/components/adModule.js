import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const token = localStorage.getItem('token');

const AdModule = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {


        if (token) {
            const decoded = jwtDecode(token);
            setUser({
                id: decoded.id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: decoded.role,
            });
        }



        const fetchAds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/ads/active', {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                setAds(response.data);
            } catch (err) {
                setError('Не вдалося завантажити оголошення');
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    if (loading) {
        return <p>Завантаження оголошень...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="ad-module">
          <h3>Дошка оголошень</h3>
          {ads.length > 0 ? (
            <ul>
              {ads.map((ad) => (
                <li key={ad._id}>
                  <h4>{ad.title}</h4>
                  <p>{ad.description}</p>
                  <p>
                    <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
                  </p>
                  <p>
                    <strong>Дата створення:</strong>{' '}
                    {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Наразі немає активних оголошень.</p>
          )}
        </div>
      );
      
};

export default AdModule;
