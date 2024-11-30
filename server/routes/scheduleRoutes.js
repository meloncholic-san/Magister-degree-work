const express = require("express");
const { getSchedule } = require("../controllers/schedulerController");

const router = express.Router();

// Маршрут для отримання даних JSON
router.get("/api/schedule", getSchedule);

module.exports = router;
