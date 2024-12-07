
//client/src/components/infrastructureModule.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import 'react-datepicker/dist/react-datepicker.css';
import Schedule from './TurnOffSchedule';
import Header from './Header';


registerLocale('uk', uk); // Реєструємо українську локалізацію

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
  const [selectedDate, setSelectedDate] = useState(new Date()); // Поточна дата

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

  // Викликаємо fetchStatistics при зміні дати
  useEffect(() => {
    const month = selectedDate.getMonth() + 1; // Місяць (1-12)
    const year = selectedDate.getFullYear(); // Рік
    fetchStatistics(month, year);
  }, [selectedDate]);

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

//   <div>
//   <Schedule />
// </div>

return (
  <div className="infrastructure-container">
              <Header />
  <div className="infrastructure-module">

      <div className="infrastructure-schedule">
        <Schedule />
      </div>
    <h2 className="infrastructure-title">Статус Інфраструктури</h2>
    {loading ? (
      <p className="infrastructure-loading">Завантаження...</p>
    ) : (
      <div className="infrastructure-content">
        {user && user.role === "admin" ? (
          <form
            className="infrastructure-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateInfrastructureStatus();
            }}
          >
            <label className="form-label">
              Статус вантажного ліфта:
              <select
                className="form-select"
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
            <label className="form-label">
              Статус пасажирського ліфта:
              <select
                className="form-select"
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
            <label className="form-label">
              Статус комунальних послуг:
              <input
                className="form-input"
                type="text"
                value={infrastructure.utilityStatus}
                onChange={(e) =>
                  setInfrastructure({ ...infrastructure, utilityStatus: e.target.value })
                }
              />
            </label>
            <button className="form-button" type="submit">
              Оновити статус
            </button>
          </form>
) : (
  <div className="infrastructure-status">
    <table className="status-table">
      <thead>
        <tr>
          <th>Категорія</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Вантажний ліфт</td>
          <td>{infrastructure.cargoElevatorStatus}</td>
        </tr>
        <tr>
          <td>Пасажирський ліфт</td>
          <td>{infrastructure.passengerElevatorStatus}</td>
        </tr>
        <tr>
          <td>Комунальні послуги</td>
          <td>{infrastructure.utilityStatus}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}


        <div className="infrastructure-statistics">
          <h3 className="statistics-title">Статистика споживання</h3>
          <label className="form-label">
            Оберіть місяць і рік:
            <DatePicker
              className="date-picker"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              locale="uk"
            />
          </label>
        <div className="statistics-data">
          <p className="statistics-item">
            Витрати води: <span className="statistics-value">{statistics.waterConsumption} м³</span>
          </p>
          <p className="statistics-item">
            Витрати газу: <span className="statistics-value">{statistics.gasConsumption} м³</span>
          </p>
          <p className="statistics-item">
            Витрати електроенергії: <span className="statistics-value">{statistics.electricityConsumption} кВт·год</span>
          </p>
        </div>

        </div>


      </div>
    )}
    {message && <p className="infrastructure-message">{message}</p>}
  </div>
  </div>
);

};

export default InfrastructureModule;
