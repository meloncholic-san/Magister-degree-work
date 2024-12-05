
// //client/src/components/adModule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const token = localStorage.getItem('token');

const AdModule = () => {
    const [ads, setAds] = useState([]);
    const [pendingAds, setPendingAds] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);


        // Завантаження інформації про користувача
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
        }, []);


    // Завантаження активних оголошень при зміні користувача
    useEffect(() => {
        if (user) {
            const fetchAds = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/ads/active', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAds(response.data);
                } catch (err) {
                    setError('Не вдалося завантажити активні оголошення');
                } finally {
                    setLoading(false);
                }
            };

            fetchAds();
        }
    }, [user]); // Залежність від user
    
    // Завантаження очікуючих оголошень тільки для адміністраторів
    useEffect(() => {
        if (user && user.role === 'admin') {
            const fetchPendingAds = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/ads/pending', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setPendingAds(response.data);
                } catch (err) {
                    console.error('Помилка при завантаженні очікуючих оголошень:', err);
                    setError('Не вдалося завантажити очікуючі оголошення');
                }
            };

            fetchPendingAds();
        }
    }, [user]); // Залежність від user

    const handleActivateAd = async (adId) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/ads/activate/${adId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Оголошення розміщено:', response.data);
//   // Оновлюємо стейт активних оголошень
//   setAds([...ads, response.data]);
        
//   // Видаляємо оголошення з pendingAds
//   setPendingAds(pendingAds.filter(ad => ad._id !== adId));
        } catch (error) {
            console.error('Помилка активації оголошення:', error.message);
        }
    };

    const handleDismissAd = async (adId) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/ads/dismiss/${adId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Оголошення видалено:', response.data);

            // // Оновлюємо стан активних оголошень, видаляючи оголошення з списку
            // setAds(ads.filter(ad => ad._id !== adId));
        } catch (error) {
            console.error('Помилка видалення оголошення:', error.message);
        }
    };

    const handleMarkAdAsCompleted = async (adId) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/ads/complete/${adId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Оголошення завершено:', response.data);
    
            // Оновлюємо стейт активних оголошень, якщо потрібно
            setAds(ads.map(ad => ad._id === adId ? { ...ad, status: 'completed' } : ad));
        } catch (error) {
            console.error('Помилка завершення оголошення:', error.message);
        }
    };
    
    if (loading) {
        return <p>Завантаження оголошень...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Завантаження даних користувача...</p>;
    }

    return (
        <div className="ad-module">
            <h3 className="ad-module__title">Дошка оголошень</h3>
            {ads.length > 0 ? (
                <ul className="ad-module__list">
                    {ads.map((ad) => (
                        <li key={ad._id} className="ad-module__item">
                            <h4 className="ad-module__item-title">{ad.title}</h4>
                            <p className="ad-module__item-description">{ad.description}</p>
                            <p className="ad-module__item-author">
                                <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
                            </p>
                            <p className="ad-module__item-date">
                                <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
                            </p>
                            {user && user.role === 'admin' && (
                                <button className="ad-module__button ad-module__button--complete" onClick={() => handleMarkAdAsCompleted(ad._id)}>✔ Завершити оголошення</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="ad-module__empty">Наразі немає активних оголошень.</p>
            )}
    
            {user && user.role === 'admin' && pendingAds.length > 0 && (
                <div className="ad-module__pending">
                    <h3 className="ad-module__title">Очікуючі оголошення</h3>
                    <ul className="ad-module__list">
                        {pendingAds.map((ad) => (
                            <li key={ad._id} className="ad-module__item">
                                <h4 className="ad-module__item-title">{ad.title}</h4>
                                <p className="ad-module__item-description">{ad.description}</p>
                                <p className="ad-module__item-author">
                                    <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
                                </p>
                                <p className="ad-module__item-date">
                                    <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
                                </p>
                                <button className="ad-module__button ad-module__button--activate" onClick={() => handleActivateAd(ad._id)}>Розмістити оголошення</button>
                                <button className="ad-module__button ad-module__button--dismiss" onClick={() => handleDismissAd(ad._id)}>Видалити оголошення</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    
};

export default AdModule;
