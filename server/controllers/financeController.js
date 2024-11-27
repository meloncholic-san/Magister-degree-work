// server/controllers/financeController.js


const OsbbStatistics = require('../models/OsbbStatistics');
const User = require('../models/User');
const { getApartmentArea } = require('../utils/apartmentUtils');

// Отримати список активних зборів та внески користувачів

// exports.getActiveCollections = async (req, res) => {
//   try {
//     const collections = await OsbbStatistics.find({ debt: { $gt: 0 } }).populate('payments.userId', 'name apartmentNumber');
//     const users = await User.find({}, 'name apartmentNumber');

//     // Додаємо внески для кожного користувача на основі площі
//     const detailedCollections = collections.map((collection) => {
//       const contributions = users.map((user) => {
//         const area = getApartmentArea(user.apartmentNumber);
//         const userContribution = (collection.totalAmount / 5776) * area; // 5776 — загальна площа всіх квартир у будинку
//         const userPaid = collection.payments.find(
//           (p) => p.userId && p.userId.toString() === user._id.toString()
//         )?.amount || 0;
        

//         return {
//           name: user.name,
//           apartmentNumber: user.apartmentNumber,
//           area,
//           requiredContribution: userContribution.toFixed(2),
//           paid: userPaid,
//           remaining: (userContribution - userPaid).toFixed(2),
//         };
//       });

//       return {
//         purpose: collection.purpose,
//         totalAmount: collection.totalAmount,
//         collectedAmount: collection.collectedAmount,
//         debt: collection.debt,
//         contributions,
//       };
//     });

//     res.json(detailedCollections);
//   } catch (error) {
//     console.error('Error fetching active collections:', error.message);
//     res.status(500).json({ message: 'Error fetching active collections' });
//   }
// };


// // Отримати список активних зборів та внески користувачів
// exports.getActiveCollections = async (req, res) => {
//   try {
//     const userId = req.user.userId; // Отримуємо ID поточного користувача із токена
//     const userRole = req.user.role; // Отримуємо роль користувача (наприклад, 'admin' або 'user')
//     console.log(userId,userRole);
//     const collections = await OsbbStatistics.find({ debt: { $gt: 0 } }).populate('payments.userId', 'name apartmentNumber');

//     // Якщо користувач - адмін, повертаємо всі деталі
//     if (userRole === 'admin') {
//       const users = await User.find({}, 'name apartmentNumber');

//       const detailedCollections = collections.map((collection) => {
//         const contributions = users.map((user) => {
//           const area = getApartmentArea(user.apartmentNumber);
//           const userContribution = (collection.totalAmount / 5776) * area; // Розрахунок внеску
//           const userPaid = collection.payments.find(
//             (p) => p.userId && p.userId.toString() === user._id.toString()
//           )?.amount || 0;

//           return {
//             name: user.name,
//             apartmentNumber: user.apartmentNumber,
//             area,
//             requiredContribution: userContribution.toFixed(2),
//             paid: userPaid,
//             remaining: (userContribution - userPaid).toFixed(2),
//           };
//         });

//         return {
//           purpose: collection.purpose,
//           totalAmount: collection.totalAmount,
//           collectedAmount: collection.collectedAmount,
//           debt: collection.debt,
//           contributions,
//         };
//       });

//       return res.json(detailedCollections);
//     }

//     // Якщо користувач - не адмін, показуємо тільки його дані
//     const userCollections = collections.map((collection) => {
//       const userPayment = collection.payments.find(
//         (p) => p.userId && p.userId.toString() === userId.toString()
//       );

//       if (!userPayment) return null; // Якщо немає платежів для цього користувача, пропускаємо

//       const area = getApartmentArea(req.user.apartmentNumber);
//       const userContribution = (collection.totalAmount / 5776) * area;

//       return {
//         purpose: collection.purpose,
//         totalAmount: collection.totalAmount,
//         collectedAmount: collection.collectedAmount,
//         debt: collection.debt,
//         userPayment: {
//           area,
//           requiredContribution: userContribution.toFixed(2),
//           paid: userPayment.amount,
//           remaining: (userContribution - userPayment.amount).toFixed(2),
//         },
//       };
//     }).filter(Boolean); // Видаляємо null значення

//     res.json(userCollections);
//   } catch (error) {
//     console.error('Error fetching active collections:', error.message);
//     res.status(500).json({ message: 'Error fetching active collections' });
//   }
// };






// // Отримати список активних зборів та внески користувачів
// exports.getActiveCollections = async (req, res) => {
//   try {
//     const userId = req.user.id; // ID поточного користувача
//     const isAdmin = req.user.role === 'admin'; // Перевірка, чи є користувач адміністратором

//     const collections = await OsbbStatistics.find({ debt: { $gt: 0 } }).populate('payments.userId', 'name apartmentNumber');
//     const users = await User.find({}, 'name apartmentNumber');

//     const detailedCollections = collections.map((collection) => {
//       if (isAdmin) {
//         // Якщо адміністратор, показуємо всі внески
//         const contributions = users.map((user) => {
//           const area = getApartmentArea(user.apartmentNumber);
//           const userContribution = (collection.totalAmount / 5776) * area; // Розрахунок внеску
//           const userPaid = collection.payments.find(
//             (p) => p.userId && p.userId.toString() === user._id.toString()
//           )?.amount || 0;

//           return {
//             name: user.name,
//             apartmentNumber: user.apartmentNumber,
//             area,
//             requiredContribution: userContribution.toFixed(2),
//             paid: userPaid,
//             remaining: (userContribution - userPaid).toFixed(2),
//           };
//         });

//         return {
//           purpose: collection.purpose,
//           totalAmount: collection.totalAmount,
//           collectedAmount: collection.collectedAmount,
//           debt: collection.debt,
//           contributions,
//         };
//       } else {
//         // Якщо користувач, показуємо тільки його внески
//         const userArea = getApartmentArea(req.user.apartmentNumber);
//         const userContribution = (collection.totalAmount / 5776) * userArea;
//         const userPaid = collection.payments.find(
//           (p) => p.userId && p.userId.toString() === userId
//         )?.amount || 0;

//         return {
//           purpose: collection.purpose,
//           totalAmount: collection.totalAmount,
//           collectedAmount: collection.collectedAmount,
//           debt: collection.debt,
//           userPayment: {
//             requiredContribution: userContribution.toFixed(2),
//             paid: userPaid,
//             remaining: (userContribution - userPaid).toFixed(2),
//           },
//         };
//       }
//     });

//     res.json(detailedCollections);
//   } catch (error) {
//     console.error('Error fetching active collections:', error.message);
//     res.status(500).json({ message: 'Error fetching active collections' });
//   }
// };



exports.getActiveCollections = async (req, res) => {
  try {
    const userId = req.user.id; // ID поточного користувача
    const isAdmin = req.user.role === 'admin'; // Перевірка, чи є користувач адміністратором

    const collections = await OsbbStatistics.find({ debt: { $gt: 0 } }).populate('payments.userId', 'name apartmentNumber');
    const users = await User.find({}, 'name apartmentNumber');

    const detailedCollections = collections.map((collection) => {
      if (isAdmin) {
        // Якщо адміністратор, показуємо всі внески
        const contributions = users.map((user) => {
          const area = getApartmentArea(user.apartmentNumber);
          const userContribution = (collection.totalAmount / 5776) * area; // Розрахунок внеску
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
      } else {
        // Якщо користувач, показуємо тільки його внески
        const userArea = getApartmentArea(req.user.apartmentNumber);
        const userContribution = (collection.totalAmount / 5776) * userArea;
        const userPaid = collection.payments.find(
          (p) => p.userId && p.userId.toString() === userId
        )?.amount || 0;

        return {
          purpose: collection.purpose,
          totalAmount: collection.totalAmount,
          collectedAmount: collection.collectedAmount,
          debt: collection.debt,
          userPayment: {
            requiredContribution: userContribution.toFixed(2),
            paid: userPaid,
            remaining: (userContribution - userPaid).toFixed(2),
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