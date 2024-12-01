// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import { jwtDecode } from 'jwt-decode'; 

// const token = localStorage.getItem('token');

// const InfrastructureModule = () => {
//   const [infrastructure, setInfrastructure] = useState({
//     cargoElevatorStatus: '',
//     passengerElevatorStatus: '',
//     utilityStatus: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // Функція для отримання статусу інфраструктури
//   const fetchInfrastructureStatus = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/api/infrastructure', {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//       setInfrastructure(response.data);
//     } catch (error) {
//       console.error('Помилка при отриманні статусу інфраструктури:', error);
//       setMessage('Не вдалося завантажити статус інфраструктури');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функція для оновлення статусу інфраструктури
//   const updateInfrastructureStatus = async () => {
//     setLoading(true);
//     try {
//         const response = await axios.put(
//             'http://localhost:5000/api/infrastructure',
//             infrastructure,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
          
//       setInfrastructure(response.data);
//       setMessage('Статус інфраструктури успішно оновлено');
//     } catch (error) {
//       console.error('Помилка при оновленні статусу інфраструктури:', error);
//       setMessage('Не вдалося оновити статус інфраструктури');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функція для створення нового запису інфраструктури
//   const createInfrastructureStatus = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/infrastructure',
//         infrastructure,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setInfrastructure(response.data.data);
//       setMessage('Новий статус інфраструктури створено');
//     } catch (error) {
//       console.error('Помилка при створенні статусу інфраструктури:', error);
//       setMessage('Не вдалося створити новий статус інфраструктури');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Завантаження даних при першому рендері
//   useEffect(() => {
//     fetchInfrastructureStatus();
//   }, []);

//   return (
//     <div>
//       <h1>Модуль Інфраструктури</h1>
//       {loading ? (
//         <p>Завантаження...</p>
//       ) : (
//         <div>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               updateInfrastructureStatus();
//             }}
//           >
//             <label>
//               Статус вантажного ліфта:
//               <select
//                 value={infrastructure.cargoElevatorStatus}
//                 onChange={(e) =>
//                   setInfrastructure({ ...infrastructure, cargoElevatorStatus: e.target.value })
//                 }
//               >
//                 <option value="Норма">Норма</option>
//                 <option value="Вимкнуто">Вимкнуто</option>
//                 <option value="Обслуговується">Обслуговується</option>
//               </select>
//             </label>
//             <br />
//             <label>
//               Статус пасажирського ліфта:
//               <select
//                 value={infrastructure.passengerElevatorStatus}
//                 onChange={(e) =>
//                   setInfrastructure({ ...infrastructure, passengerElevatorStatus: e.target.value })
//                 }
//               >
//                 <option value="Норма">Норма</option>
//                 <option value="Вимкнуто">Вимкнуто</option>
//                 <option value="Обслуговується">Обслуговується</option>
//               </select>
//             </label>
//             <br />
//             <label>
//               Статус комунальних послуг:
//               <input
//                 type="text"
//                 value={infrastructure.utilityStatus}
//                 onChange={(e) =>
//                   setInfrastructure({ ...infrastructure, utilityStatus: e.target.value })
//                 }
//               />
//             </label>
//             <br />
//             <button type="submit">Оновити статус</button>
//           </form>
//           <br />
//           <button onClick={createInfrastructureStatus}>Створити новий запис</button>
//         </div>
//       )}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default InfrastructureModule;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const token = localStorage.getItem('token');

// const InfrastructureModule = () => {
//   const [infrastructure, setInfrastructure] = useState({
//     cargoElevatorStatus: '',
//     passengerElevatorStatus: '',
//     utilityStatus: '',
//   });
//   const [consumptionStatistics, setConsumptionStatistics] = useState({
//     month: '',
//     year: '',
//     waterConsumption: '',
//     gasConsumption: '',
//     electricityConsumption: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [user, setUser] = useState(null);


//           // Завантаження інформації про користувача
//           useEffect(() => {
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


//   // Отримання статусу інфраструктури
//   const fetchInfrastructureStatus = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/infrastructure', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setInfrastructure(response.data);
//     } catch (error) {
//       console.error('Помилка при отриманні статусу інфраструктури:', error);
//       setMessage('Не вдалося завантажити статус інфраструктури');
//     }
//   };

//   // Оновлення статусу інфраструктури
//   const updateInfrastructureStatus = async () => {
//     try {
//       const response = await axios.put(
//         'http://localhost:5000/api/infrastructure',
//         infrastructure,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setInfrastructure(response.data);
//       setMessage('Статус інфраструктури успішно оновлено');
//     } catch (error) {
//       console.error('Помилка при оновленні статусу інфраструктури:', error);
//       setMessage('Не вдалося оновити статус інфраструктури');
//     }
//   };

//   // Отримання статистики споживання
//   const fetchConsumptionStatistics = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/consumption-statistics', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           month: consumptionStatistics.month,
//           year: consumptionStatistics.year,
//         },
//       });
//       setConsumptionStatistics(response.data);
//     } catch (error) {
//       console.error('Помилка при отриманні статистики споживання:', error);
//       setMessage('Не вдалося завантажити статистику споживання');
//     }
//   };

//   // Оновлення статистики споживання
//   const updateConsumptionStatistics = async () => {
//     try {
//       const response = await axios.put(
//         'http://localhost:5000/api/consumption-statistics',
//         consumptionStatistics,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setConsumptionStatistics(response.data);
//       setMessage('Статистика споживання успішно оновлена');
//     } catch (error) {
//       console.error('Помилка при оновленні статистики споживання:', error);
//       setMessage('Не вдалося оновити статистику споживання');
//     }
//   };

//   // Завантаження даних при першому рендері
//   useEffect(() => {
//     fetchInfrastructureStatus();
//   }, []);

//   return (
//     <div>
//       <h1>Модуль Інфраструктури та Статистики</h1>
//       {loading ? (
//         <p>Завантаження...</p>
//       ) : (
//         <div>
//           <h2>Статус Інфраструктури</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               updateInfrastructureStatus();
//             }}
//           >
//             <label>
//               Статус вантажного ліфта:
//               <select
//                 value={infrastructure.cargoElevatorStatus}
//                 onChange={(e) =>
//                   setInfrastructure({ ...infrastructure, cargoElevatorStatus: e.target.value })
//                 }
//               >
//                 <option value="Норма">Норма</option>
//                 <option value="Вимкнуто">Вимкнуто</option>
//                 <option value="Обслуговується">Обслуговується</option>
//               </select>
//             </label>
//             <br />
//             <label>
//               Статус пасажирського ліфта:
//               <select
//                 value={infrastructure.passengerElevatorStatus}
//                 onChange={(e) =>
//                   setInfrastructure({ ...infrastructure, passengerElevatorStatus: e.target.value })
//                 }
//               >
//                 <option value="Норма">Норма</option>
//                 <option value="Вимкнуто">Вимкнуто</option>
//                 <option value="Обслуговується">Обслуговується</option>
//               </select>
//             </label>
//             <br />
//             <label>
//               Статус комунальних послуг:
//               <input
//                 type="text"
//                 value={infrastructure.utilityStatus}
//                 onChange={(e) =>
//                   setInfrastructure({ ...infrastructure, utilityStatus: e.target.value })
//                 }
//               />
//             </label>
//             <br />
//             <button type="submit">Оновити статус</button>
//           </form>
//           <h2>Статистика Споживання</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               updateConsumptionStatistics();
//             }}
//           >
//             <label>
//               Місяць:
//               <input
//                 type="number"
//                 value={consumptionStatistics.month}
//                 onChange={(e) =>
//                   setConsumptionStatistics({ ...consumptionStatistics, month: e.target.value })
//                 }
//               />
//             </label>
//             <br />
//             <label>
//               Рік:
//               <input
//                 type="number"
//                 value={consumptionStatistics.year}
//                 onChange={(e) =>
//                   setConsumptionStatistics({ ...consumptionStatistics, year: e.target.value })
//                 }
//               />
//             </label>
//             <br />
//             <label>
//               Споживання води:
//               <input
//                 type="number"
//                 value={consumptionStatistics.waterConsumption}
//                 onChange={(e) =>
//                   setConsumptionStatistics({
//                     ...consumptionStatistics,
//                     waterConsumption: e.target.value,
//                   })
//                 }
//               />
//             </label>
//             <br />
//             <label>
//               Споживання газу:
//               <input
//                 type="number"
//                 value={consumptionStatistics.gasConsumption}
//                 onChange={(e) =>
//                   setConsumptionStatistics({
//                     ...consumptionStatistics,
//                     gasConsumption: e.target.value,
//                   })
//                 }
//               />
//             </label>
//             <br />
//             <label>
//               Споживання електроенергії:
//               <input
//                 type="number"
//                 value={consumptionStatistics.electricityConsumption}
//                 onChange={(e) =>
//                   setConsumptionStatistics({
//                     ...consumptionStatistics,
//                     electricityConsumption: e.target.value,
//                   })
//                 }
//               />
//             </label>
//             <br />
//             <button type="submit">Оновити статистику</button>
//           </form>
//         </div>
//       )}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default InfrastructureModule;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';

// const token = localStorage.getItem('token');

// const InfrastructureModule = () => {
//   const [infrastructure, setInfrastructure] = useState({
//     cargoElevatorStatus: '',
//     passengerElevatorStatus: '',
//     utilityStatus: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [user, setUser] = useState(null);

//   // Завантаження інформації про користувача
//   useEffect(() => {
//     if (token) {
//       const decoded = jwtDecode(token);
//       setUser({
//         id: decoded.id,
//         firstName: decoded.firstName,
//         lastName: decoded.lastName,
//         role: decoded.role,
//       });
//     }
//   }, []);

//   // Функція для отримання статусу інфраструктури
//   const fetchInfrastructureStatus = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/api/infrastructure', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setInfrastructure(response.data);
//     } catch (error) {
//       console.error('Помилка при отриманні статусу інфраструктури:', error);
//       setMessage('Не вдалося завантажити статус інфраструктури');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функція для оновлення статусу інфраструктури
//   const updateInfrastructureStatus = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.put(
//         'http://localhost:5000/api/infrastructure',
//         infrastructure,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setInfrastructure(response.data);
//       setMessage('Статус інфраструктури успішно оновлено');
//     } catch (error) {
//       console.error('Помилка при оновленні статусу інфраструктури:', error);
//       setMessage('Не вдалося оновити статус інфраструктури');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Завантаження даних при першому рендері
//   useEffect(() => {
//     fetchInfrastructureStatus();
//   }, []);

//   return (
//     <div>
//       <h2>Статус Інфраструктури</h2>
//       {loading ? (
//         <p>Завантаження...</p>
//       ) : (
//         <div>
//           {user && user.role === 'admin' ? (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 updateInfrastructureStatus();
//               }}
//             >
//               <label>
//                 Статус вантажного ліфта:
//                 <select
//                   value={infrastructure.cargoElevatorStatus}
//                   onChange={(e) =>
//                     setInfrastructure({ ...infrastructure, cargoElevatorStatus: e.target.value })
//                   }
//                 >
//                   <option value="Норма">Норма</option>
//                   <option value="Вимкнуто">Вимкнуто</option>
//                   <option value="Обслуговується">Обслуговується</option>
//                 </select>
//               </label>
//               <br />
//               <label>
//                 Статус пасажирського ліфта:
//                 <select
//                   value={infrastructure.passengerElevatorStatus}
//                   onChange={(e) =>
//                     setInfrastructure({ ...infrastructure, passengerElevatorStatus: e.target.value })
//                   }
//                 >
//                   <option value="Норма">Норма</option>
//                   <option value="Вимкнуто">Вимкнуто</option>
//                   <option value="Обслуговується">Обслуговується</option>
//                 </select>
//               </label>
//               <br />
//               <label>
//                 Статус комунальних послуг:
//                 <input
//                   type="text"
//                   value={infrastructure.utilityStatus}
//                   onChange={(e) =>
//                     setInfrastructure({ ...infrastructure, utilityStatus: e.target.value })
//                   }
//                 />
//               </label>
//               <br />
//               <button type="submit">Оновити статус</button>
//             </form>
//           ) : (
//             <div>
//               <p>Статус вантажного ліфта: {infrastructure.cargoElevatorStatus}</p>
//               <p>Статус пасажирського ліфта: {infrastructure.passengerElevatorStatus}</p>
//               <p>Статус комунальних послуг: {infrastructure.utilityStatus}</p>
//             </div>
//           )}
//         </div>
//       )}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default InfrastructureModule;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');

const InfrastructureModule = () => {
  const [infrastructure, setInfrastructure] = useState({
    cargoElevatorStatus: '',
    passengerElevatorStatus: '',
    utilityStatus: '',
  });
  const [statistics, setStatistics] = useState({
    waterConsumption: 0,
    gasConsumption: 0,
    electricityConsumption: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Поточний місяць (1-12)
  const [year, setYear] = useState(new Date().getFullYear()); // Поточний рік

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

  // Функція для отримання статусу інфраструктури
  const fetchInfrastructureStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/infrastructure', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInfrastructure(response.data);
    } catch (error) {
      console.error('Помилка при отриманні статусу інфраструктури:', error);
      setMessage('Не вдалося завантажити статус інфраструктури');
    } finally {
      setLoading(false);
    }
  };

  // Функція для отримання статистики споживання
  const fetchStatistics = async (month, year) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/consumption', {
        params: { month, year },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Помилка при отриманні статистики споживання:', error);
      setMessage('Не вдалося завантажити статистику споживання');
    } finally {
      setLoading(false);
    }
  };

  // Викликаємо fetchStatistics при зміні місяця чи року
  useEffect(() => {
    fetchStatistics(month, year);
  }, [month, year]);

  // Функція для оновлення статусу інфраструктури
  const updateInfrastructureStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:5000/api/infrastructure',
        infrastructure,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInfrastructure(response.data);
      setMessage('Статус інфраструктури успішно оновлено');
    } catch (error) {
      console.error('Помилка при оновленні статусу інфраструктури:', error);
      setMessage('Не вдалося оновити статус інфраструктури');
    } finally {
      setLoading(false);
    }
  };

  // Завантаження даних при першому рендері
  useEffect(() => {
    fetchInfrastructureStatus();
  }, []);

  return (
    <div>
      <h2>Статус Інфраструктури</h2>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div>
          {user && user.role === 'admin' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateInfrastructureStatus();
              }}
            >
              <label>
                Статус вантажного ліфта:
                <select
                  value={infrastructure.cargoElevatorStatus}
                  onChange={(e) =>
                    setInfrastructure({ ...infrastructure, cargoElevatorStatus: e.target.value })
                  }
                >
                  <option value="Норма">Норма</option>
                  <option value="Вимкнуто">Вимкнуто</option>
                  <option value="Обслуговується">Обслуговується</option>
                </select>
              </label>
              <br />
              <label>
                Статус пасажирського ліфта:
                <select
                  value={infrastructure.passengerElevatorStatus}
                  onChange={(e) =>
                    setInfrastructure({ ...infrastructure, passengerElevatorStatus: e.target.value })
                  }
                >
                  <option value="Норма">Норма</option>
                  <option value="Вимкнуто">Вимкнуто</option>
                  <option value="Обслуговується">Обслуговується</option>
                </select>
              </label>
              <br />
              <label>
                Статус комунальних послуг:
                <input
                  type="text"
                  value={infrastructure.utilityStatus}
                  onChange={(e) =>
                    setInfrastructure({ ...infrastructure, utilityStatus: e.target.value })
                  }
                />
              </label>
              <br />
              <button type="submit">Оновити статус</button>
            </form>
          ) : (
            <div>
              <p>Статус вантажного ліфта: {infrastructure.cargoElevatorStatus}</p>
              <p>Статус пасажирського ліфта: {infrastructure.passengerElevatorStatus}</p>
              <p>Статус комунальних послуг: {infrastructure.utilityStatus}</p>
            </div>
          )}

          <div>
            <h3>Статистика споживання</h3>
            <label>
              Місяць:
              <input
                type="month"
                value={`${year}-${month.toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [selectedYear, selectedMonth] = e.target.value.split('-');
                  setYear(Number(selectedYear));
                  setMonth(Number(selectedMonth));
                }}
              />
            </label>
            <div>
              <p>Витрати води: {statistics.waterConsumption} м³</p>
              <p>Витрати газу: {statistics.gasConsumption} м³</p>
              <p>Витрати електроенергії: {statistics.electricityConsumption} кВт·год</p>
            </div>
          </div>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default InfrastructureModule;
