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

    if (req.user.role !== 'admin') {
        console.log('Користувач не є адміністратором, доступ заборонено.');
        return res.status(403).json({ message: 'Ви не маєте права завершати активні оголошення' });
      }

    ad.status = 'completed';
    await ad.save();
    res.json({ message: 'Оголошення завершено', ad });
  } catch (error) {
    console.error('Error marking ad as completed:', error.message);
    res.status(500).json({ message: 'Помилка зміни статусу оголошення' });
  }
};


//активівувати оголошення
exports.activateAd = async (req, res) => {
    try {
        const { adId } = req.params;
        console.log(`Запит на активацію оголошення з ID: ${adId}`);
  
        const ad = await Ad.findById(adId);
        if (!ad) {
            console.log(`Оголошення з ID ${adId} не знайдено`);
            return res.status(404).json({ message: 'Оголошення не знайдено' });
        }
  
        // Перевірка прав доступу для адміністратора
        if (req.user.role !== 'admin') {
            console.log(`Користувач ${req.user.username} не має прав для активації оголошення`);
            return res.status(403).json({ message: 'Ви не маєте права змінювати статус оголошення' });
        }
  
        console.log(`Активація оголошення з ID ${adId}`);
        ad.status = 'active';
        await ad.save();
        console.log(`Оголошення з ID ${adId} успішно активовано`);
        res.json({ message: 'Оголошення розміщено', ad });
    } catch (error) {
        console.error('Error activating ad:', error.message);
        res.status(500).json({ message: 'Помилка зміни статусу оголошення' });
    }
};
  
// Видалити оголошення
exports.dismissAd = async (req, res) => {
    try {
        const { adId } = req.params;
        console.log(`Запит на видалення оголошення з ID: ${adId}`);
  
        const ad = await Ad.findById(adId);
        if (!ad) {
            console.log(`Оголошення з ID ${adId} не знайдено`);
            return res.status(404).json({ message: 'Оголошення не знайдено' });
        }
  
        // Перевірка прав доступу для адміністратора
        if (req.user.role !== 'admin') {
            console.log(`Користувач ${req.user.username} не має прав для видалення оголошення`);
            return res.status(403).json({ message: 'Ви не маєте права видаляти оголошення' });
        }
  
        console.log(`Видалення оголошення з ID ${adId}`);
        ad.status = 'dismissed';
        await ad.save();
        console.log(`Оголошення з ID ${adId} успішно видалено`);
        res.json({ message: 'Оголошення видалено', ad });
    } catch (error) {
        console.error('Error dismissing ad:', error.message);
        res.status(500).json({ message: 'Помилка видалення оголошення' });
    }
};



    // Отримати всі очікуючі оголошення (pending)
    exports.getPendingAds = async (req, res) => {
    try {
      // Логування запиту
      console.log('Запит на отримання очікуючих оголошень від користувача:', req.user);
  
      // Перевірка прав доступу для адміністратора
      if (req.user.role !== 'admin') {
        console.log('Користувач не є адміністратором, доступ заборонено.');
        return res.status(403).json({ message: 'Ви не маєте права дивитись очікуючі оголошення' });
      }
  
      // Виконуємо пошук
      console.log('Пошук очікуючих оголошень у базі даних...');
      const pendingAds = await Ad.find({ status: 'pending' })
        .populate('userId', 'username firstName lastName');
  
      // Логування результату пошуку
      console.log('Ось список очікуючих оголошень:', pendingAds);
  
      res.json(pendingAds);
    } catch (error) {
      console.error('Помилка при отриманні очікуючих оголошень:', error.message);
      res.status(500).json({ message: 'Помилка отримання очікуючих оголошень' });
    }
  };
  