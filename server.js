const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // مهم عشان Pi Browser يقدر يكلم السيرفر
app.use(express.json());

// تأكد أنك ضايف هذا في Environment Variables على Render
const PI_API_KEY = process.env.PI_API_KEY; 
const PI_API_URL = 'https://api.minepi.com/v2';

if (!PI_API_KEY) {
  console.error("FATAL: PI_API_KEY is not set in environment variables.");
}

const headers = {
  'Authorization': `Key ${PI_API_KEY}`,
  'Content-Type': 'application/json'
};

// صفحة رئيسية للتأكد أن السيرفر شغال
app.get('/', (req, res) => {
  res.send('Nexo Global Pi Server is running ✅');
});

// 1. مسار الموافقة على الدفع - لازم يرد خلال 20 ثانية
app.post('/payments/approve', async (req, res) => {
  const { paymentId } = req.body;
  console.log(`[Approve] Request for paymentId: ${paymentId}`);

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is required" });
  }

  try {
    await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, { headers });
    console.log(`[Approve] Success for paymentId: ${paymentId}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Approve] Error:', error.response?.data || error.message);
    return res.status(500).json({ error: "Approval failed on server" });
  }
});

// 2. مسار إكمال الدفع - بعد توقيع المستخدم
app.post('/payments/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  console.log(`[Complete] Request for paymentId: ${paymentId}, txid: ${txid}`);

  if (!paymentId ||!txid) {
    return res.status(400).json({ error: "paymentId and txid are required" });
  }

  try {
    const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, { headers });
    
    // هنا تحط الكود تبعك: تفعيل الاشتراك، تسجيل في قاعدة البيانات، الخ
    console.log(`[Complete] Success for paymentId: ${paymentId}`);
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('[Complete] Error:', error.response?.data || error.message);
    return res.status(500).json({ error: "Completion failed on server" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
