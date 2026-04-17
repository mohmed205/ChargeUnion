const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح الـ API الخاص بك من إعدادات Render (Environment Variables)
const PI_API_KEY = process.env.PI_API_KEY;

// 1. المسار الأساسي (لحل مشكلة Cannot GET / وظهور صفحة بيضاء)
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: #673ab7;">سيرفر Nexo Global يعمل بنجاح ✅</h1>
                <p>بانتظار عمليات الدفع والاشتراكات من Pi Browser</p>
                <div style="margin-top: 20px; font-size: 0.8em; color: gray;">
                    المطور: محمد عمار - صفاقس 2026
                </div>
            </body>
        </html>
    `);
});

// 2. نقطة النهاية للموافقة على الدفع (Approve)
app.post('/approve-payment', async (req, res) => {
    const paymentId = req.body.paymentId;
    if (!paymentId) {
        return res.status(400).json({ error: "Missing paymentId" });
    }

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: { Authorization: `Key ${PI_API_KEY}` }
            }
        );
        console.log("✅ تمت الموافقة على الدفع بنجاح:", paymentId);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("❌ خطأ في الموافقة:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to approve payment" });
    }
});

// 3. نقطة النهاية لإكمال الدفع (Complete)
app.post('/complete-payment', async (req, res) => {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) {
        return res.status(400).json({ error: "Missing paymentId or txid" });
    }

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            {
                headers: { Authorization: `Key ${PI_API_KEY}` }
            }
        );
        console.log("🎊 تم إكمال الدفع بنجاح:", paymentId);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("❌ خطأ في الإكمال:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to complete payment" });
    }
});

// 4. تشغيل السيرفر على بورت Render أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
