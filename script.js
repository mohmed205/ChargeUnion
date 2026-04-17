// 1. تهيئة Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

// 2. إعدادات السيرفر والدومين
const SERVER_URL = "https://mohmed205-github-io.onrender.com"; // رابط سيرفر Render الخاص بك

async function login() {
    // تحديد الصلاحيات المطلوبة (حل مشكلة هاتف زوجتك)
    const scopes = ['username', 'payments', 'wallet_address']; 
    
    try {
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        // تحديث الواجهة عند نجاح الدخول
        document.getElementById('username').innerText = "@" + auth.user.username;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        
        // إظهار أزرار العمليات
        document.getElementById('pay-btn').style.display = 'block';
        document.getElementById('sub-btn').style.display = 'block';
        
        document.getElementById('status-text').innerText = "تم الاتصال بنجاح ✅";
    } catch (error) {
        console.error("Login Error:", error);
        alert("تأكد من فتح الرابط داخل متصفح Pi Browser");
    }
}

// 3. دالة معالجة الدفع (لإتمام الخطوة العاشرة)
async function makePayment() {
    try {
        const paymentData = {
            amount: 0.001, // مبلغ بسيط جداً للاختبار
            memo: "اختبار الخطوة العاشرة لـ Charger Union",
            metadata: { orderId: "12345", type: "test_payment" }
        };

        const callbacks = {
            onReadyForServerApproval: async (paymentId) => {
                // إرسال الطلب لسيرفر Render للموافقة
                const response = await fetch(`${SERVER_URL}/approve-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                });
                return response.ok;
            },
            onReadyForServerCompletion: async (paymentId, txid) => {
                // إرسال الـ TXID للسيرفر لإكمال العملية
                await fetch(`${SERVER_URL}/complete-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId, txid })
                });
                alert("تمت العملية بنجاح! تفقد لوحة التحكم الآن ✅");
            },
            onCancel: (paymentId) => console.log("تم إلغاء الدفع"),
            onError: (error, payment) => console.error("خطأ في الدفع:", error)
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}

// دالة معالجة العمليات غير المكتملة
function onIncompletePaymentFound(payment) {
    console.log("وجدت عملية معلقة:", payment);
}
