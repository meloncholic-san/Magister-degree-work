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

  const translateStatus = (status) => {
    switch (status) {
      case "non-scheduled":
        return "Світло гарантоване";
      case "scheduled":
        return "Відключення заплановане";
      case "scheduled-maybe":
        return "Відключення можливі";
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchSchedule();
    const intervalId = setInterval(fetchSchedule, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p className="schedule-loading">Завантаження...</p>;
  if (error) return <p className="schedule-error">Помилка: {error}</p>;

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Розклад відключень</h1>
      <p className="schedule-status">{schedule.outageInfo.status}</p>

      {schedule.outageInfo.status !== "Світло за нашою адресою" && (
        <div className="schedule-info">
          {schedule.outageInfo.reason && <p className="schedule-reason">{schedule.outageInfo.reason}</p>}
          {schedule.outageInfo.startTime && <p className="schedule-start-time">Час початку: {schedule.outageInfo.startTime}</p>}
          {schedule.outageInfo.estimatedRecovery && <p className="schedule-recovery-time">Орієнтовне відновлення: {schedule.outageInfo.estimatedRecovery}</p>}
        </div>
      )}

      <table className="schedule-table">
        <thead>
          <tr>
            <th className="table-header">Часовий слот</th>
            <th className="table-header">Статус</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(schedule).map(([day, times], index) =>
            Array.isArray(times) ? (
              <React.Fragment key={index}>
                <tr>
                  <td colSpan="2" className="table-day">
                    {day}
                  </td>
                </tr>
                {times.map((timeSlot, i) => (
                  <tr key={i}>
                    <td className="table-time-slot">{timeSlot.timeSlot}</td>
                    <td className={`table-status ${timeSlot.status}`}>
                      {translateStatus(timeSlot.status)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ) : null
          )}
        </tbody>
      </table>

    </div>
  );
};

export default Schedule;
