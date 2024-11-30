import React, { useEffect, useState } from "react";

const Schedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchSchedule = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/schedule");
      if (!response.ok) {
        throw new Error("Не вдалося завантажити розклад");
      }
      const data = await response.json();
      setSchedule(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchSchedule(); // Запит при завантаженні компонента
      const intervalId = setInterval(fetchSchedule, 3600000); // Запит кожні 60 хвилин
  
      return () => clearInterval(intervalId); // Очищення інтервалу при розмонтуванні компонента
    }, []);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <h1>Розклад відключень</h1>
      <p>{schedule.outageInfo.status}</p>
  
      {schedule.outageInfo.status !== "Світло за нашою адресою" && (
        <>
          {schedule.outageInfo.reason && <p>{schedule.outageInfo.reason}</p>}
          {schedule.outageInfo.startTime && <p>Час початку: {schedule.outageInfo.startTime}</p>}
          {schedule.outageInfo.estimatedRecovery && <p>Орієнтовне відновлення: {schedule.outageInfo.estimatedRecovery}</p>}
        </>
      )}
  
      {Object.entries(schedule).map(([day, times], index) =>
        Array.isArray(times) ? (
          <div key={index}>
            <h2>{day}</h2>
            <ul>
              {times.map((timeSlot, i) => (
                <li key={i}>
                  {timeSlot.timeSlot}: {timeSlot.status}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
  
  
};

export default Schedule;
