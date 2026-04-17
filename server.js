const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح الـ API الخاص بك سيتم سحبه من إعدادات Render التي ضبطناها سابقاً
const PI_API_KEY = process.env.PI_API_KEY;

// نقطة النهاية (Endpoint) للموافقة على الدفع
app.post('/approve-payment', async (req, res) => {
    const paymentId = req.body.paymentId;

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: { Authorization: `Key ${PI_API_KEY}` }
            }
        );
        console.log("Payment Approved:", paymentId);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Approval Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to approve payment" });
    }
});

// نقطة النهاية لإكمال الدفع بعد وصوله للبلوكشين
app.post('/complete-payment', async (req, res) => {
    const { paymentId, txid } = req.body;

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            {
                headers: { Authorization: `Key ${PI_API_KEY}` }
            }
        );
        console.log("Payment Completed:", paymentId);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Completion Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to complete payment" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
          
