
//server/controllers/paymentController.js
const crypto = require('crypto');
const axios = require('axios');
const UserPayment = require('../models/UserPayment');
const OsbbStatistics = require('../models/OsbbStatistics'); // Підключаємо модель статистики


// Публічні та приватні ключі LiqPay
const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY;
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY;

// Генерація підпису
const generateSignature = (data) => {
  const str = PRIVATE_KEY + data + PRIVATE_KEY;
  const signature = crypto.createHash('sha1').update(str).digest('base64');
  console.log('Generated signature:', signature);
  return signature;
};


// Формування даних для платіжної форми
const createPaymentData = (paymentData) => {
  console.log('Preparing payment data:', paymentData);
  const data = Buffer.from(JSON.stringify(paymentData)).toString('base64');
  const signature = generateSignature(data);

  console.log('Encoded payment data (base64):', data);
  console.log('Generated signature for payment:', signature);

  return { data, signature };
};

// Запит до API LiqPay
const apiRequest = async (path, data) => {
  try {
    console.log('Making API request to LiqPay:', `https://www.liqpay.ua/api/request`);
    
    const signature = generateSignature(data);
    const formData = new URLSearchParams();
    formData.append('data', data);
    formData.append('signature', signature);

    console.log('Request data:', data);
    console.log('Generated signature:', signature);

    const response = await axios.post(`https://www.liqpay.ua/api/request`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error during API request to ${path}:`, error.message);
    throw new Error('Error while communicating with LiqPay API');
  }
};

// Створення платежу
exports.createPayment = async (req, res) => {
  console.log('Received request to create payment');
  
    const userId = req.user.userId; // userId із токена, доданого через middleware

    console.log(`Створення платежу для користувача: ${userId}`);

  const { amount, description, purpose  } = req.body;

  if (!userId || !amount || !description || !purpose) {
    console.log('Missing required fields:', { userId, amount, description, purpose });
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const orderId = `osbb_${Date.now()}_${userId}`;
  console.log('Generated unique order ID:', orderId);
  console.log("HERE IS USER ID:", userId);
  const paymentData = {
    public_key: PUBLIC_KEY,
    version: 3,
    action: 'pay',
    amount,
    currency: 'UAH',
    description,
    order_id: orderId,
    sandbox: 1, // Тестовий режим
  };

  console.log('Payment data before encoding:', paymentData);

  const { data, signature } = createPaymentData(paymentData);

  try {
    // Зберігаємо платіж у базу даних
    console.log('Saving payment information to the database');
    const newPayment = new UserPayment({
      userId,
      orderId,
      amount,
      status: 'pending',
      description,
      purpose, // Додаємо purpose
    });
    console.log("NOVA PLATIZKA",newPayment);
    await newPayment.save();
    console.log(`Payment successfully saved for orderId: ${orderId}`);


    // // Оновлюємо статистику ОСББ
    // console.log(`Updating OSBB statistics for purpose: ${purpose}`);
    // const osbbStat = await OsbbStatistics.findOne({ purpose });

    // if (osbbStat) 
    //   {

      // Перевірка, чи вже існує платіж від цього користувача
      console.log(`Перевірка, чи вже існує платіж від цього користувача для платіжки: ${purpose}`);
      const osbbStat = await OsbbStatistics.findOne({ purpose });
      const userAlreadyPaid = osbbStat.payments.some(payment => String(payment.userId) === String(userId));

      if (userAlreadyPaid) {
        console.log(`User with ID ${userId} has already paid for purpose: ${purpose}`);
        // Повертаємо статус 403, якщо користувач вже платив
        return res.status(403).json({
          message: `User has already paid for purpose: ${purpose}`
        });
      }


      //   // Оновлення існуючої статистики
      //   osbbStat.collectedAmount = parseFloat(osbbStat.collectedAmount) + parseFloat(amount) || 0; // переконуємося, що це числа
      //   osbbStat.debt = Math.max(0, osbbStat.totalAmount - osbbStat.collectedAmount); // перерахунок боргу

      //   osbbStat.payments.push({ userId, amount });
      //   await osbbStat.save();
      //   console.log(`Updated OSBB statistic for purpose: ${purpose}`);
      // }



    res.json({
      orderId,
      data,
      signature,
      url: 'https://www.liqpay.ua/api/3/checkout',
    });
  } catch (error) {
    console.error(`Error saving payment for orderId ${orderId}:`, error.message);
    res.status(500).json({ message: 'Error creating payment' });
  }
};


// // Статус платежу

// exports.getPaymentStatus = async (req, res) => {

//   try {
//     const { orderId } = req.params;
//     if (!orderId) {
//       return res.status(400).json({ message: 'Missing orderId' });
//     }

    
//     const data = Buffer.from(JSON.stringify({
//       public_key: PUBLIC_KEY,
//       version: 3,
//       action: 'status',
//       order_id: orderId
//     })).toString('base64');

//     const response = await apiRequest('/request', data);

//     if (response.status === 'success' || response.status === 'sandbox') {
//       // Оновлюємо статус у базі
//       await UserPayment.findOneAndUpdate(
//         { orderId },
//         { status: response.status, paymentId: response.payment_id, updatedAt: new Date() },
//         { new: true }
//       );
//     } else if (response.status === 'failure') {
//       await UserPayment.findOneAndUpdate(
//         { orderId },
//         { status: 'failure', updatedAt: new Date() },
//         { new: true }
//       );
//     }

//     return res.json({ message: `Payment status updated: ${response.status}`, response });
//   } catch (error) {
//     console.error('Error fetching payment status:', error.message);
//     res.status(500).json({ message: 'Error fetching payment status' });
//   }
// };

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }

    const data = Buffer.from(
      JSON.stringify({
        public_key: PUBLIC_KEY,
        version: 3,
        action: 'status',
        order_id: orderId,
      })
    ).toString('base64');

    const response = await apiRequest('/request', data);

    // Оновлюємо статус платежу у базі
    if (response.status === 'success' || response.status === 'sandbox') {
      const payment = await UserPayment.findOneAndUpdate(
        { orderId },
        { status: response.status, paymentId: response.payment_id, updatedAt: new Date() },
        { new: true }
      );

      if (payment) {
        const { purpose, userId, amount } = payment; // Передбачається, що ці дані вже є у моделі UserPayment

        // Оновлюємо статистику ОСББ
        console.log(`Updating OSBB statistics for purpose: ${purpose}`);
        const osbbStat = await OsbbStatistics.findOne({ purpose });

        if (osbbStat) {
          osbbStat.collectedAmount = parseFloat(osbbStat.collectedAmount) + parseFloat(amount) || 0; // Переконуємося, що це числа
          osbbStat.debt = Math.max(0, osbbStat.totalAmount - osbbStat.collectedAmount); // Перерахунок боргу

          osbbStat.payments.push({ userId, amount });
          await osbbStat.save();
          console.log(`Updated OSBB statistic for purpose: ${purpose}`);
        } else {
          console.warn(`No OSBB statistics found for purpose: ${purpose}`);
        }
      }
    } else if (response.status === 'failure') {
      await UserPayment.findOneAndUpdate(
        { orderId },
        { status: 'failure', updatedAt: new Date() },
        { new: true }
      );
    }

    return res.json({ message: `Payment status updated: ${response.status}`, response });
  } catch (error) {
    console.error('Error fetching payment status:', error.message);
    res.status(500).json({ message: 'Error fetching payment status' });
  }
};
