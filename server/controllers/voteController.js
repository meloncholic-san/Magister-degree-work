// server/controllers/voteController.js

const Vote = require('../models/Vote');

// Функция для подсчета голосов
const countVotes = (votes) => {
  const yesVotes = votes.filter(vote => vote.option === 'yes').length;
  const noVotes = votes.filter(vote => vote.option === 'no').length;
  const totalVotes = votes.length;
  return { yesVotes, noVotes, totalVotes };
};

// Получение текущего голосования
exports.getCurrentVote = async (req, res) => {
  try {
    const currentVote = await Vote.findOne({ status: 'active' });
    if (!currentVote) {
      return res.status(404).json({ message: 'Текущего голосования нет' });
    }

    // Получаем подсчет голосов для текущего голосования
    const { yesVotes, noVotes, totalVotes } = countVotes(currentVote.votes);

    // Добавляем информацию о голосах в ответ
    res.json({
      ...currentVote.toObject(),
      yesVotes,
      noVotes,
      totalVotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении текущего голосования' });
  }
};

// Получение истории голосований
exports.getVoteHistory = async (req, res) => {
  try {
    // Фильтруем голосования, чтобы получить только те, которые завершены
    const votesHistory = await Vote.find({ status: 'completed' });

    // Функция для подсчета голосов
    const countVotes = (votes) => {
      const yesVotes = votes.filter(vote => vote.option === 'yes').length;
      const noVotes = votes.filter(vote => vote.option === 'no').length;
      const totalVotes = votes.length;
      return { yesVotes, noVotes, totalVotes };
    };

    // Подсчитываем голоса для каждого голосования в истории
    const votesWithCounts = votesHistory.map(vote => {
      const { yesVotes, noVotes, totalVotes } = countVotes(vote.votes);
      return {
        ...vote.toObject(),
        yesVotes,
        noVotes,
        totalVotes
      };
    });

    res.json(votesWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении истории голосований' });
  }
};

// Создание нового голосования

exports.createVote = async (req, res) => {
  const { question, options, durationHours  } = req.body;

  // Проверка, что активных голосований нет
  const activeVote = await Vote.findOne({ status: 'active' });
  if (activeVote) {
    return res.status(400).json({ message: 'Есть активное голосование. Необходимо завершить его, прежде чем начать новое.' });
  }

  // Если не активное голосование, то создаем новое
  try {
    // Перевірка, чи є хоча б одна опція
    if (!options || options.length < 2) {
      return res.status(400).json({ message: 'Для голосування потрібно мінімум дві опції.' });
    }

    // Рассчитать время окончания, если задано
    const expiresAt = durationHours ? new Date(Date.now() + durationHours * 60 * 60 * 1000) : null;

    // Створюємо нове голосування
    const newVote = new Vote({
      question,
      options,
      status: 'active',  // Статус активне
      createdBy: req.user.id,
      expiresAt, // Добавляем время окончания, если задано
    });

    await newVote.save();
    res.status(201).json(newVote);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании голосования' });
  }
};


exports.vote = async (req, res) => {
  try {
    const { voteId, option } = req.body;
    const userId = req.user.userId;
    console.log('Received vote:', { voteId, option, userId }); // Лог для перевірки даних

    if (!voteId || !option) {
      return res.status(400).json({ error: 'voteId and option are required' });
    }

    // Знаходимо голосування
    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    // Перевіряємо, чи користувач уже голосував
    const existingVote = vote.votes.find((v) => v.userId && v.userId.toString() === userId);
    if (existingVote) {
      // Вернемо детальный ответ, что пользователь уже проголосовал
      return res.status(409).json({
        error: 'User has already voted',
        message: 'You have already cast your vote. You cannot vote again.',
        status: 'conflict',
        previousVote: existingVote.option, // Добавляем информацию о предыдущем голосе
      });
    }

    // Додаємо новий голос
    vote.votes.push({ userId, option });

    // Оновлюємо підрахунок голосів
    vote.results.set(option, (vote.results.get(option) || 0) + 1);

    // Зберігаємо зміни
    await vote.save();

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error handling vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getVoterDetails = async (req, res) => {
  try {
    const { voteId } = req.params;

    const vote = await Vote.findById(voteId).populate('votes.userId', 'firstName lastName apartmentNumber');
    if (!vote) {
      return res.status(404).json({ message: 'Голосование не найдено' });
    }

    // Формируем список проголосовавших
    const voters = vote.votes.map(vote => ({
      firstName: vote.userId.firstName,
      lastName: vote.userId.lastName,
      apartmentNumber: vote.userId.apartmentNumber,
      option: vote.option,
    }));

    res.status(200).json(voters);
  } catch (error) {
    console.error('Ошибка при получении данных о проголосовавших:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Завершение текущего голосования
exports.completeVote = async (req, res) => {
  try {
    const { voteId } = req.body; // Получаем ID голосования из тела запроса

    // Ищем голосование
    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    // Проверяем, имеет ли пользователь роль администратора
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to complete the vote' });
    }

    // Обновляем статус голосования на 'completed'
    vote.status = 'completed';

    // Сохраняем изменения
    await vote.save();

    res.status(200).json({ message: 'Vote completed successfully' });
  } catch (error) {
    console.error('Error completing vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
