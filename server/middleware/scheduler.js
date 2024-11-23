// scheduler.js

const schedule = require('node-schedule');
const Vote = require('../models/Vote');

// Функция для планирования завершения голосований
const scheduleVoteCompletion = () => {
  schedule.scheduleJob('*/1 * * * *', async () => {
    const now = new Date();
    const votesToComplete = await Vote.find({ status: 'active', expiresAt: { $lte: now } });

    for (const vote of votesToComplete) {
      vote.status = 'completed';
      await vote.save();
      console.log(`Голосование "${vote.question}" завершено автоматически.`);
    }
  });
};

module.exports = { scheduleVoteCompletion };
