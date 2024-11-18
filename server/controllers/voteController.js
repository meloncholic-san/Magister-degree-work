const Vote = require('../models/Vote');

// Получение текущего голосования
exports.getCurrentVote = async (req, res) => {
  try {
    const currentVote = await Vote.findOne({ status: 'active' });
    if (!currentVote) {
      return res.status(404).json({ message: 'Текущего голосования нет' });
    }
    res.json(currentVote);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении текущего голосования' });
  }
};

// Получение истории голосований
exports.getVoteHistory = async (req, res) => {
  try {
    const votesHistory = await Vote.find();
    res.json(votesHistory);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении истории голосований' });
  }
};

// Создание нового голосования
exports.createVote = async (req, res) => {
  const { question, options } = req.body;
  try {
    const newVote = new Vote({
      question,
      options,
      status: 'active',
      createdBy: req.user.id,
    });
    await newVote.save();
    res.status(201).json(newVote);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании голосования' });
  }
};

// Голосование
exports.vote = async (req, res) => {
  const { voteId, option } = req.body;
  try {
    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({ message: 'Голосование не найдено' });
    }
    const userVote = vote.votes.find(v => v.userId.toString() === req.user.id);
    if (userVote) {
      return res.status(400).json({ message: 'Вы уже проголосовали' });
    }
    vote.votes.push({ userId: req.user.id, option });
    await vote.save();
    res.json(vote);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при голосовании' });
  }
};
