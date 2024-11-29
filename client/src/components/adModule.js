
// //client/src/components/adModule.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode'; 

// const token = localStorage.getItem('token');

// const AdModule = () => {
//     const [ads, setAds] = useState([]);
//     const [pendingAds, setPendingAds] = useState([]); 
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);

//     useEffect(() => {

//         if (token) {
//         const decoded = jwtDecode(token);
//         setUser({
//           id: decoded.id,
//           firstName: decoded.firstName,
//           lastName: decoded.lastName,
//           role: decoded.role,
//         });
//       }

//         const fetchAds = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/ads/active', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setAds(response.data);
//             } catch (err) {
//                 setError('Не вдалося завантажити активні оголошення');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchPendingAds = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/ads/pending', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 console.log('Очікуючі оголошення завантажено:', response.data);
//                 setPendingAds(response.data); // Збережіть отримані дані в стані
//             } catch (err) {
//                 console.error('Помилка при завантаженні очікуючих оголошень:', err);
//                 setError('Не вдалося завантажити очікуючі оголошення');
//             }
//         };

//         fetchAds();
//         fetchPendingAds();
//     }, []);

//     const handleActivateAd = async (adId) => {
//         try {
//             const response = await axios.patch(`http://localhost:5000/api/ads/activate/${adId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Оголошення розміщено:', response.data);
//             setAds(ads.map(ad => ad._id === adId ? { ...ad, status: 'active' } : ad));
//         } catch (error) {
//             console.error('Помилка активації оголошення:', error.message);
//         }
//     };

//     const handleDismissAd = async (adId) => {
//         try {
//             const response = await axios.patch(`http://localhost:5000/api/ads/dismiss/${adId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Оголошення видалено:', response.data);
//             setAds(ads.filter(ad => ad._id !== adId));
//         } catch (error) {
//             console.error('Помилка видалення оголошення:', error.message);
//         }
//     };

//     if (loading) {
//         return <p>Завантаження оголошень...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div className="ad-module">
//             <h3>Дошка оголошень</h3>
//             {ads.length > 0 ? (
//                 <ul>
//                     {ads.map((ad) => (
//                         <li key={ad._id}>
//                             <h4>{ad.title}</h4>
//                             <p>{ad.description}</p>
//                             <p>
//                                 <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                             </p>
//                             <p>
//                                 <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                             </p>


//                             {user && user.role === 'admin' && pendingAds.length > 0 && (
//                                 <div>
//                                     <h3>Очікуючі оголошення</h3>
//                                     <ul>
//                                         {pendingAds.map((ad) => (
//                                             <li key={ad._id}>
//                                                 <h4>{ad.title}</h4>
//                                                 <p>{ad.description}</p>
//                                                 <p>
//                                                     <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                                                 </p>
//                                                 <p>
//                                                     <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                                                 </p>
//                                                 <button onClick={() => handleActivateAd(ad._id)}>Розмістити оголошення</button>
//                                                 <button onClick={() => handleDismissAd(ad._id)}>Видалити оголошення</button>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>Наразі немає активних оголошень.</p>
//             )}
//         </div>
//     );
// };

// export default AdModule;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode'; 

// const token = localStorage.getItem('token');

// const AdModule = () => {
//     const [ads, setAds] = useState([]);
//     const [pendingAds, setPendingAds] = useState([]); 
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);


//         // Завантаження інформації про користувача
//         useEffect(() => {
//             if (token) {
//                 const decoded = jwtDecode(token);
//                 setUser({
//                     id: decoded.id,
//                     firstName: decoded.firstName,
//                     lastName: decoded.lastName,
//                     role: decoded.role,
//                 });
//             }
//         }, []);


//     // Завантаження активних оголошень при зміні користувача
//     useEffect(() => {
//         if (user) {
//             const fetchAds = async () => {
//                 try {
//                     const response = await axios.get('http://localhost:5000/api/ads/active', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setAds(response.data);
//                 } catch (err) {
//                     setError('Не вдалося завантажити активні оголошення');
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             fetchAds();
//         }
//     }, [user]); // Залежність від user


//     // Завантаження очікуючих оголошень тільки для адміністраторів
//     useEffect(() => {
//         if (user && user.role === 'admin') {
//             const fetchPendingAds = async () => {
//                 try {
//                     const response = await axios.get('http://localhost:5000/api/ads/pending', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     console.log('Очікуючі оголошення завантажено:', response.data);
//                     setPendingAds(response.data);
//                 } catch (err) {
//                     console.error('Помилка при завантаженні очікуючих оголошень:', err);
//                     setError('Не вдалося завантажити очікуючі оголошення');
//                 }
//             };

//             fetchPendingAds();
//         }
//     }, [user]); // Залежність від user

//     const handleActivateAd = async (adId) => {
//         try {
//             const response = await axios.patch(`http://localhost:5000/api/ads/activate/${adId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Оголошення розміщено:', response.data);
// //   // Оновлюємо стейт активних оголошень
// //   setAds([...ads, response.data]);
        
// //   // Видаляємо оголошення з pendingAds
// //   setPendingAds(pendingAds.filter(ad => ad._id !== adId));
//         } catch (error) {
//             console.error('Помилка активації оголошення:', error.message);
//         }
//     };

//     const handleDismissAd = async (adId) => {
//         try {
//             const response = await axios.patch(`http://localhost:5000/api/ads/dismiss/${adId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Оголошення видалено:', response.data);

//             // // Оновлюємо стан активних оголошень, видаляючи оголошення з списку
//             // setAds(ads.filter(ad => ad._id !== adId));
//         } catch (error) {
//             console.error('Помилка видалення оголошення:', error.message);
//         }
//     };

//     const handleMarkAdAsCompleted = async (adId) => {
//         try {
//             const response = await axios.patch(`http://localhost:5000/api/ads/complete/${adId}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Оголошення завершено:', response.data);
    
//             // Оновлюємо стейт активних оголошень, якщо потрібно
//             setAds(ads.map(ad => ad._id === adId ? { ...ad, status: 'completed' } : ad));
//         } catch (error) {
//             console.error('Помилка завершення оголошення:', error.message);
//         }
//     };
    
//     if (loading) {
//         return <p>Завантаження оголошень...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     if (!user) {
//         return <p>Завантаження даних користувача...</p>;
//     }

//     return (
//         <div className="ad-module">
//             <h3 className="ad-module__title">Дошка оголошень</h3>
//             {ads.length > 0 ? (
//                 <ul className="ad-module__list">
//                     {ads.map((ad) => (
//                         <li key={ad._id} className="ad-module__item">
//                             <h4 className="ad-module__item-title">{ad.title}</h4>
//                             <p className="ad-module__item-description">{ad.description}</p>
//                             <p className="ad-module__item-author">
//                                 <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                             </p>
//                             <p className="ad-module__item-date">
//                                 <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                             </p>
//                             {user && user.role === 'admin' && (
//                                 <button className="ad-module__button ad-module__button--complete" onClick={() => handleMarkAdAsCompleted(ad._id)}>✔ Завершити оголошення</button>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="ad-module__empty">Наразі немає активних оголошень.</p>
//             )}
    
//             {user && user.role === 'admin' && pendingAds.length > 0 && (
//                 <div className="ad-module__pending">
//                     <h3 className="ad-module__title">Очікуючі оголошення</h3>
//                     <ul className="ad-module__list">
//                         {pendingAds.map((ad) => (
//                             <li key={ad._id} className="ad-module__item">
//                                 <h4 className="ad-module__item-title">{ad.title}</h4>
//                                 <p className="ad-module__item-description">{ad.description}</p>
//                                 <p className="ad-module__item-author">
//                                     <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                                 </p>
//                                 <p className="ad-module__item-date">
//                                     <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                                 </p>
//                                 <button className="ad-module__button ad-module__button--activate" onClick={() => handleActivateAd(ad._id)}>Розмістити оголошення</button>
//                                 <button className="ad-module__button ad-module__button--dismiss" onClick={() => handleDismissAd(ad._id)}>Видалити оголошення</button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
    
// };

// export default AdModule;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';

// const token = localStorage.getItem('token');

// const AdModule = () => {
//     const [ads, setAds] = useState([]);
//     const [pendingAds, setPendingAds] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);

//     // Завантаження інформації про користувача
//     useEffect(() => {
//         if (token) {
//             const decoded = jwtDecode(token);
//             setUser({
//                 id: decoded.id,
//                 firstName: decoded.firstName,
//                 lastName: decoded.lastName,
//                 role: decoded.role,
//             });
//         }
//     }, []);

//     // Завантаження активних оголошень при зміні користувача
//     useEffect(() => {
//         const fetchAds = async () => {
//             if (user) {
//                 setLoading(true); // Початок завантаження
//                 try {
//                     const response = await axios.get('http://localhost:5000/api/ads/active', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setAds(response.data);
//                 } catch (err) {
//                     setError('Не вдалося завантажити активні оголошення');
//                 } finally {
//                     setLoading(false); // Завершення завантаження
//                 }
//             }
//         };

//         if (user) {
//             fetchAds();
//         }
//     }, [user]); // Залежність від user

//     // Завантаження очікуючих оголошень тільки для адміністраторів
//     useEffect(() => {
//         const fetchPendingAds = async () => {
//             if (user && user.role === 'admin') {
//                 setLoading(true); // Початок завантаження
//                 try {
//                     const response = await axios.get('http://localhost:5000/api/ads/pending', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setPendingAds(response.data);
//                 } catch (err) {
//                     console.error('Помилка при завантаженні очікуючих оголошень:', err);
//                     setError('Не вдалося завантажити очікуючі оголошення');
//                 } finally {
//                     setLoading(false); // Завершення завантаження
//                 }
//             }
//         };

//         if (user && user.role === 'admin') {
//             fetchPendingAds();
//         }
//     }, [user]); // Залежність від user

//     if (loading) {
//         return <p>Завантаження оголошень...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     if (!user) {
//         return <p>Завантаження даних користувача...</p>;
//     }

//     return (
//         <div className="ad-module">
//             <h3 className="ad-module__title">Дошка оголошень</h3>
//             {ads.length > 0 ? (
//                 <ul className="ad-module__list">
//                     {ads.map((ad) => (
//                         <li key={ad._id} className="ad-module__item">
//                             <h4 className="ad-module__item-title">{ad.title}</h4>
//                             <p className="ad-module__item-description">{ad.description}</p>
//                             <p className="ad-module__item-author">
//                                 <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                             </p>
//                             <p className="ad-module__item-date">
//                                 <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                             </p>
//                             {user && user.role === 'admin' && (
//                                 <button className="ad-module__button ad-module__button--complete" onClick={() => handleMarkAdAsCompleted(ad._id)}>✔ Завершити оголошення</button>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="ad-module__empty">Наразі немає активних оголошень.</p>
//             )}

//             {user && user.role === 'admin' && pendingAds.length > 0 && (
//                 <div className="ad-module__pending">
//                     <h3 className="ad-module__title">Очікуючі оголошення</h3>
//                     <ul className="ad-module__list">
//                         {pendingAds.map((ad) => (
//                             <li key={ad._id} className="ad-module__item">
//                                 <h4 className="ad-module__item-title">{ad.title}</h4>
//                                 <p className="ad-module__item-description">{ad.description}</p>
//                                 <p className="ad-module__item-author">
//                                     <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                                 </p>
//                                 <p className="ad-module__item-date">
//                                     <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                                 </p>
//                                 <button className="ad-module__button ad-module__button--activate" onClick={() => handleActivateAd(ad._id)}>Розмістити оголошення</button>
//                                 <button className="ad-module__button ad-module__button--dismiss" onClick={() => handleDismissAd(ad._id)}>Видалити оголошення</button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdModule;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';

// const token = localStorage.getItem('token');

// const AdModule = () => {
//     const [ads, setAds] = useState([]);
//     const [pendingAds, setPendingAds] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);
//     const [dataLoaded, setDataLoaded] = useState(false); // новий стан для перевірки завантаження даних

//     // Завантаження інформації про користувача
//     useEffect(() => {
//         if (token) {
//             const decoded = jwtDecode(token);
//             setUser({
//                 id: decoded.id,
//                 firstName: decoded.firstName,
//                 lastName: decoded.lastName,
//                 role: decoded.role,
//             });
//         }
//     }, []);

//     // Завантаження активних оголошень при зміні користувача
//     useEffect(() => {
//         const fetchAds = async () => {
//             if (user) {
//                 try {
//                     setLoading(true);
//                     const response = await axios.get('http://localhost:5000/api/ads/active', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setAds(response.data);
//                 } catch (err) {
//                     setError('Не вдалося завантажити активні оголошення');
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };

//         if (user) {
//             fetchAds();
//         }
//     }, [user]);

//     // Завантаження очікуючих оголошень тільки для адміністраторів
//     useEffect(() => {
//         const fetchPendingAds = async () => {
//             if (user && user.role === 'admin') {
//                 try {
//                     setLoading(true);
//                     const response = await axios.get('http://localhost:5000/api/ads/pending', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setPendingAds(response.data);
//                 } catch (err) {
//                     console.error('Помилка при завантаженні очікуючих оголошень:', err);
//                     setError('Не вдалося завантажити очікуючі оголошення');
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };

//         if (user && user.role === 'admin') {
//             fetchPendingAds();
//         }
//     }, [user]);

//     // Оновлення dataLoaded після завантаження всіх даних
//     useEffect(() => {
//         if (user && !loading && (ads.length > 0 || pendingAds.length > 0 || user.role !== 'admin')) {
//             setDataLoaded(true);
//         }
//     }, [loading, ads, pendingAds, user]);

//     if (!dataLoaded) {
//         return <p>Завантаження даних модулю...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     if (!user) {
//         return <p>Завантаження даних користувача...</p>;
//     }

//     return (
//         <div className="ad-module">
//             <h3 className="ad-module__title">Дошка оголошень</h3>
//             {ads.length > 0 ? (
//                 <ul className="ad-module__list">
//                     {ads.map((ad) => (
//                         <li key={ad._id} className="ad-module__item">
//                             <h4 className="ad-module__item-title">{ad.title}</h4>
//                             <p className="ad-module__item-description">{ad.description}</p>
//                             <p className="ad-module__item-author">
//                                 <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                             </p>
//                             <p className="ad-module__item-date">
//                                 <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                             </p>
//                             {user && user.role === 'admin' && (
//                                 <button className="ad-module__button ad-module__button--complete" onClick={() => handleMarkAdAsCompleted(ad._id)}>✔ Завершити оголошення</button>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="ad-module__empty">Наразі немає активних оголошень.</p>
//             )}

//             {user && user.role === 'admin' && pendingAds.length > 0 && (
//                 <div className="ad-module__pending">
//                     <h3 className="ad-module__title">Очікуючі оголошення</h3>
//                     <ul className="ad-module__list">
//                         {pendingAds.map((ad) => (
//                             <li key={ad._id} className="ad-module__item">
//                                 <h4 className="ad-module__item-title">{ad.title}</h4>
//                                 <p className="ad-module__item-description">{ad.description}</p>
//                                 <p className="ad-module__item-author">
//                                     <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                                 </p>
//                                 <p className="ad-module__item-date">
//                                     <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                                 </p>
//                                 <button className="ad-module__button ad-module__button--activate" onClick={() => handleActivateAd(ad._id)}>Розмістити оголошення</button>
//                                 <button className="ad-module__button ad-module__button--dismiss" onClick={() => handleDismissAd(ad._id)}>Видалити оголошення</button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdModule;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';

// const token = localStorage.getItem('token');

// const AdModule = () => {
//     const [ads, setAds] = useState([]);
//     const [pendingAds, setPendingAds] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);

//     // Завантаження інформації про користувача
//     useEffect(() => {
//         if (token) {
//             const decoded = jwtDecode(token);
//             setUser({
//                 id: decoded.id,
//                 firstName: decoded.firstName,
//                 lastName: decoded.lastName,
//                 role: decoded.role,
//             });
//         }
//     }, [token]); // Додати залежність від token, щоб оновлювати при зміні токена

//     // Завантаження активних оголошень при зміні користувача
//     useEffect(() => {
//         if (user) {
//             const fetchAds = async () => {
//                 try {
//                     setLoading(true);
//                     const response = await axios.get('http://localhost:5000/api/ads/active', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setAds(response.data);
//                 } catch (err) {
//                     setError('Не вдалося завантажити активні оголошення');
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             fetchAds();
//         }
//     }, [user]); // Залежність від user

//     // Завантаження очікуючих оголошень тільки для адміністраторів
//     useEffect(() => {
//         if (user && user.role === 'admin') {
//             const fetchPendingAds = async () => {
//                 try {
//                     setLoading(true);
//                     const response = await axios.get('http://localhost:5000/api/ads/pending', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setPendingAds(response.data);
//                 } catch (err) {
//                     console.error('Помилка при завантаженні очікуючих оголошень:', err);
//                     setError('Не вдалося завантажити очікуючі оголошення');
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             fetchPendingAds();
//         }
//     }, [user]); // Залежність від user

//     if (loading) {
//         return <p>Завантаження оголошень...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     if (!user) {
//         return <p>Завантаження даних користувача...</p>;
//     }

//     return (
//         <div className="ad-module">
//             <h3 className="ad-module__title">Дошка оголошень</h3>
//             {ads.length > 0 ? (
//                 <ul className="ad-module__list">
//                     {ads.map((ad) => (
//                         <li key={ad._id} className="ad-module__item">
//                             <h4 className="ad-module__item-title">{ad.title}</h4>
//                             <p className="ad-module__item-description">{ad.description}</p>
//                             <p className="ad-module__item-author">
//                                 <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                             </p>
//                             <p className="ad-module__item-date">
//                                 <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                             </p>
//                             {user && user.role === 'admin' && (
//                                 <button className="ad-module__button ad-module__button--complete" onClick={() => handleMarkAdAsCompleted(ad._id)}>✔ Завершити оголошення</button>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p className="ad-module__empty">Наразі немає активних оголошень.</p>
//             )}

//             {user && user.role === 'admin' && pendingAds.length > 0 && (
//                 <div className="ad-module__pending">
//                     <h3 className="ad-module__title">Очікуючі оголошення</h3>
//                     <ul className="ad-module__list">
//                         {pendingAds.map((ad) => (
//                             <li key={ad._id} className="ad-module__item">
//                                 <h4 className="ad-module__item-title">{ad.title}</h4>
//                                 <p className="ad-module__item-description">{ad.description}</p>
//                                 <p className="ad-module__item-author">
//                                     <strong>Автор:</strong> {ad.userId ? ad.userId.username : 'Невідомий'}
//                                 </p>
//                                 <p className="ad-module__item-date">
//                                     <strong>Дата створення:</strong> {new Date(ad.createdAt).toLocaleDateString('uk-UA')}
//                                 </p>
//                                 <button className="ad-module__button ad-module__button--activate" onClick={() => handleActivateAd(ad._id)}>Розмістити оголошення</button>
//                                 <button className="ad-module__button ad-module__button--dismiss" onClick={() => handleDismissAd(ad._id)}>Видалити оголошення</button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdModule;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const token = localStorage.getItem('token');

const AdModule = () => {
    const [ads, setAds] = useState([]);
    const [pendingAds, setPendingAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [componentKey, setComponentKey] = useState(0); // Додатковий стан для ключа компонента

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
    }, [token]);

    // Перезавантаження модуля при зміні користувача
    useEffect(() => {
        if (user) {
            setComponentKey(prevKey => prevKey + 1); // Оновлюємо ключ компонента
        }
    }, [user]); // Залежність від user

    // Завантаження активних оголошень при зміні ключа
    useEffect(() => {
        if (user) {
            const fetchAds = async () => {
                try {
                    setLoading(true);
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
    }, [componentKey]); // Залежність від ключа компонента

    // Завантаження очікуючих оголошень тільки для адміністраторів при зміні ключа
    useEffect(() => {
        if (user && user.role === 'admin') {
            const fetchPendingAds = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:5000/api/ads/pending', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setPendingAds(response.data);
                } catch (err) {
                    console.error('Помилка при завантаженні очікуючих оголошень:', err);
                    setError('Не вдалося завантажити очікуючі оголошення');
                } finally {
                    setLoading(false);
                }
            };

            fetchPendingAds();
        }
    }, [componentKey]); // Залежність від ключа компонента

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
        <div key={componentKey} className="ad-module"> {/* Додаємо ключ для перезавантаження компонента */}
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