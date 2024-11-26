
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
    console.log('Making API request to LiqPay:', `https://www.liqpay.ua/api/${path}`);
    
    const signature = generateSignature(data);
    const formData = new URLSearchParams();
    formData.append('data', data);
    formData.append('signature', signature);

    console.log('Request data:', data);
    console.log('Generated signature:', signature);

    const response = await axios.post(`https://www.liqpay.ua/api/${path}`, formData, {
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
  
  const { userId, amount, description, purpose  } = req.body;

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
    });

    await newPayment.save();
    console.log(`Payment successfully saved for orderId: ${orderId}`);


    // Оновлюємо статистику ОСББ
    console.log(`Updating OSBB statistics for purpose: ${purpose}`);
    const osbbStat = await OsbbStatistics.findOne({ purpose });

    if (!osbbStat) {
        // Якщо запису про збір із таким призначенням немає, створюємо новий
        const newStat = new OsbbStatistics({
          purpose,
          totalAmount: 0, // Можна передати із запиту, якщо потрібно
          collectedAmount: amount,
          payments: [{ userId, amount }],
        });
        await newStat.save();
        console.log(`Created new OSBB statistic for purpose: ${purpose}`);
      } else {
        // Якщо запис уже існує, оновлюємо його
        osbbStat.collectedAmount += amount;
        osbbStat.debt = osbbStat.totalAmount - osbbStat.collectedAmount; // Оновлюємо борг
        osbbStat.payments.push({ userId, amount });
        await osbbStat.save();
        console.log(`Updated OSBB statistic for purpose: ${purpose}`);
      }



    res.json({
      data,
      signature,
      url: 'https://www.liqpay.ua/api/3/checkout',
    });
  } catch (error) {
    console.error(`Error saving payment for orderId ${orderId}:`, error.message);
    res.status(500).json({ message: 'Error creating payment' });
  }
};

// Статус платежу
exports.getPaymentStatus = async (req, res) => {
  console.log('Received request to check payment status');

  const { orderId } = req.params;
  console.log(`Checking payment status for orderId: ${orderId}`);

  const data = {
    public_key: PUBLIC_KEY,
    action: 'status',
    version: '3',
    order_id: orderId,
  };

  console.log('Status request data:', data);

  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
  const signature = generateSignature(encodedData);

  console.log('Encoded status data (base64):', encodedData);
  console.log('Generated signature for status request:', signature);

  try {
    // Отримуємо статус платіжного запиту
    console.log('Making API request to check payment status');
    
    const status = await apiRequest('status', encodedData);//////////////////////////////////'request'

    console.log(`Received payment status for orderId ${orderId}:`, status);

    // Оновлюємо статус в базі даних
    await UserPayment.updateOne({ orderId }, { status: status.status });
    console.log(`Payment status for orderId ${orderId} updated in database`);

    res.json({ status: status.status });
  } catch (error) {
    console.error(`Error fetching payment status for orderId ${orderId}:`, error.message);
    res.status(500).json({ message: 'Error fetching payment status' });
  }
};
