//server/controllers/voteController.js

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

// exports.vote = async (req, res) => {
//   try {
//       const { voteId, option } = req.body;
//       const userId = req.user.userId; // Извлекаем userId из токена

//       console.log('Received vote:', { voteId, option, userId }); // Лог для проверки входных данных и userId

//       if (!voteId || !option) {
//           return res.status(400).json({ error: 'voteId and option are required' });
//       }

//       // Находим голосование
//       const vote = await Vote.findById(voteId);
//       console.log('Vote found:', vote); // Лог наличия голосования

//       if (!vote) {
//           return res.status(404).json({ error: 'Vote not found' });
//       }

//       // Обновляем результаты голосования
//       vote.results[option] = (vote.results[option] || 0) + 1;
//       await vote.save();
//       console.log('Vote saved:', { vote, userId }); // Лог после сохранения голоса

//       res.status(200).json({ message: 'Vote recorded successfully' });
//   } catch (error) {
//       console.error('Error handling vote:', error); // Лог ошибки
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.vote = async (req, res) => {
//   try {
//     const { voteId, option } = req.body;
//     const userId = req.user.userId; // Витягуємо userId із токена

//     console.log('Received vote:', { voteId, option, userId }); // Лог для перевірки даних

//     if (!voteId || !option) {
//       return res.status(400).json({ error: 'voteId and option are required' });
//     }

//     // Знаходимо голосування
//     const vote = await Vote.findById(voteId);
//     if (!vote) {
//       return res.status(404).json({ error: 'Vote not found' });
//     }

//     // Перевіряємо, чи вже голосував цей користувач
//     const existingVote = vote.votes.find((v) => v.userId.toString() === userId);
//     if (existingVote) {
//       return res.status(400).json({ error: 'User has already voted' });
//     }

//     // Додаємо голос користувача
//     vote.votes.push({ userId, option });

//     // Оновлюємо підрахунок голосів
//     vote.results.set(option, (vote.results.get(option) || 0) + 1);

//     // Зберігаємо оновлені дані
//     await vote.save();

//     console.log('Vote saved:', { vote, userId }); // Лог після збереження

//     res.status(200).json({ message: 'Vote recorded successfully' });
//   } catch (error) {
//     console.error('Error handling vote:', error); // Лог помилки
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


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
      return res.status(400).json({ error: 'User has already voted' });
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
