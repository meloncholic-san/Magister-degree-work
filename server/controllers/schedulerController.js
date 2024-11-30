const fs = require("fs");
const path = require("path");

// Шлях до JSON-файлу
const scheduleFilePath = path.join(__dirname, "../schedule.json");

// Функція для отримання даних розкладу
const getSchedule = (req, res) => {
  try {
    if (!fs.existsSync(scheduleFilePath)) {
      return res.status(404).json({ message: "Розклад не знайдено" });
    }

    const scheduleData = fs.readFileSync(scheduleFilePath, "utf8");
    res.json(JSON.parse(scheduleData));
  } catch (error) {
    console.error("Помилка при читанні JSON:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

module.exports = {
  getSchedule,
};
