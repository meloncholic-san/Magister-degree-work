
// server/controllers/financeController.js


const OsbbStatistics = require('../models/OsbbStatistics');
const User = require('../models/User');
const { getApartmentArea } = require('../utils/apartmentUtils');



exports.getActiveCollections = async (req, res) => {
  try {
    const userId = req.user.userId; // ID поточного користувача
    const isAdmin = req.user.role === 'admin'; 

    // Отримуємо активні збори
    const collections = await OsbbStatistics.find({ debt: { $gt: 0 } }).populate('payments.userId', 'username apartmentNumber');
    const users = await User.find({}, 'username apartmentNumber');

    const detailedCollections = collections.map((collection) => {
      if (isAdmin) {
        // Логіка для адміністратора (всі внески)
        const contributions = users.map((user) => {
          const area = getApartmentArea(user.apartmentNumber);
          const userContribution = (collection.totalAmount / 5776) * area; // Розрахунок внеску
          const userPaid = collection.payments.find(
            (p) => p.userId && p.userId.toString() === user._id.toString()
          )?.amount || 0;
          const remaining = userContribution - userPaid;
          return {
            name: user.username,
            apartmentNumber: user.apartmentNumber,
            area,
            requiredContribution: userContribution.toFixed(2),
            paid: userPaid.toFixed(2),
            remaining: Math.abs(remaining) < 0.01 ? '0.00' : remaining.toFixed(2),
          };
        });

        return {
          purpose: collection.purpose,
          totalAmount: collection.totalAmount.toFixed(2),
          collectedAmount: collection.collectedAmount.toFixed(2),
          debt: collection.debt,
          contributions,
        };
      } else {
        // Логіка для користувача (тільки його внесок)
        const userArea = getApartmentArea(req.user.apartmentNumber);
        const userContribution = (collection.totalAmount / 5776) * userArea;
        const userPaid = collection.payments.find(
          (p) => p.userId && p.userId.toString() === userId
        )?.amount || 0;
        const remaining = userContribution - userPaid;

        return {
          purpose: collection.purpose,
          totalAmount: collection.totalAmount.toFixed(2),
          collectedAmount: collection.collectedAmount.toFixed(2),
          debt: collection.debt.toFixed(2),
          userPayment: {
            requiredContribution: userContribution.toFixed(2),
            paid: userPaid.toFixed(2),
            remaining: Math.abs(remaining) < 0.01 ? '0.00' : remaining.toFixed(2),
          },
        };
      }
    });

    res.json(detailedCollections);
  } catch (error) {
    console.error('Error fetching active collections:', error.message);
    res.status(500).json({ message: 'Error fetching active collections' });
  }
};
