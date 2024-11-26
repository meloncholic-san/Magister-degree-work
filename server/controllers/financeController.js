// server/controllers/financeController.js
const OsbbStatistics = require('../models/OsbbStatistics');
const User = require('../models/User');
const { getApartmentArea } = require('../utils/apartmentUtils');

console.log(getApartmentArea);

// Отримати список активних зборів та внески користувачів
exports.getActiveCollections = async (req, res) => {
  try {
    const collections = await OsbbStatistics.find({ debt: { $gt: 0 } }).populate('payments.userId', 'name apartmentNumber');
    const users = await User.find({}, 'name apartmentNumber');

    // Додаємо внески для кожного користувача на основі площі
    const detailedCollections = collections.map((collection) => {
      const contributions = users.map((user) => {
        const area = getApartmentArea(user.apartmentNumber);
        const userContribution = (collection.totalAmount / 5776) * area; // 5776 — загальна площа всіх квартир у будинку
        const userPaid = collection.payments.find(
          (p) => p.userId && p.userId.toString() === user._id.toString()
        )?.amount || 0;
        

        return {
          name: user.name,
          apartmentNumber: user.apartmentNumber,
          area,
          requiredContribution: userContribution.toFixed(2),
          paid: userPaid,
          remaining: (userContribution - userPaid).toFixed(2),
        };
      });

      return {
        purpose: collection.purpose,
        totalAmount: collection.totalAmount,
        collectedAmount: collection.collectedAmount,
        debt: collection.debt,
        contributions,
      };
    });

    res.json(detailedCollections);
  } catch (error) {
    console.error('Error fetching active collections:', error.message);
    res.status(500).json({ message: 'Error fetching active collections' });
  }
};
