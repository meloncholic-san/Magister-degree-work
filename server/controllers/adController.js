// server/controllers/adController.js
const Ad = require('../models/Ad');

// Створити оголошення
exports.createAd = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId; // ID користувача з токена

    const newAd = new Ad({
      title,
      description,
      userId,
    });

    await newAd.save();
    res.status(201).json({ message: 'Оголошення створено успішно', ad: newAd });
  } catch (error) {
    console.error('Error creating ad:', error.message);
    res.status(500).json({ message: 'Помилка створення оголошення' });
  }
};


// Отримати всі активні оголошення
exports.getActiveAds = async (req, res) => {
    try {
      console.log('Запит на отримання активних оголошень отримано.');
  
      // Лог перед пошуком в базі
      console.log('Фільтр пошуку:', { status: 'active' });
  
      // Виконуємо пошук
      const activeAds = await Ad.find({ status: 'active' })
        .populate('userId', 'username firstName lastName');
  
      // Лог результату пошуку
      console.log('Результат пошуку в базі:', JSON.stringify(activeAds, null, 2));
  
      // Відправляємо результат на клієнт
      res.json(activeAds);
  
      console.log('Результат успішно надіслано клієнту.');
    } catch (error) {
      console.error('Помилка при отриманні активних оголошень:', error.message);
  
      // Відправляємо помилку на клієнт
      res.status(500).json({ message: 'Помилка отримання активних оголошень' });
    }
  };
  

  
// Змінити статус оголошення на "completed"
exports.markAdAsCompleted = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Оголошення не знайдено' });
    }

    if (ad.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Ви не маєте права змінювати це оголошення' });
    }

    ad.status = 'completed';
    await ad.save();
    res.json({ message: 'Оголошення завершено', ad });
  } catch (error) {
    console.error('Error marking ad as completed:', error.message);
    res.status(500).json({ message: 'Помилка зміни статусу оголошення' });
  }
};
