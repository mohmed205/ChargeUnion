// 1. تهيئة Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

// 2. إعدادات السيرفر - تأكد أن هذا رابط Render الصحيح
const SERVER_URL = "https://mohmed205-github-io-3.onrender.com"; 

async function login() {
    const scopes = ['username', 'payments', 'wallet_address']; 
    
    try {
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        document.getElementById('username').innerText = "@" + auth.user.username;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('pay-btn').style.display = 'block';
        document.getElementById('sub-btn').style.display = 'block';
        document.getElementById('status-text').innerText = "تم الاتصال بنجاح ✅";
    } catch (error) {
        console.error("Login Error:", error);
        alert("تأكد من فتح الرابط داخل متصفح Pi Browser");
    }
}

// 3. دالة معالجة الدفع - مصححة
async function makePayment() {
    try {
        const paymentData = {
            amount: 0.001,
            memo: "اختبار Charge Union",
            metadata: { orderId: "12345", type: "test_payment" }
        };

        const callbacks = {
            // عدلت المسار هنا من /approve-payment إلى /payments/approve
            onReadyForServerApproval: async (paymentId) => {
                const response = await fetch(`${SERVER_URL}/payments/approve`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                });
                if (!response.ok) throw new Error('Approve failed');
            },
            
            // عدلت المسار هنا من /complete-payment إلى /payments/complete
            onReadyForServerCompletion: async (paymentId, txid) => {
                const response = await fetch(`${SERVER_URL}/payments/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId, txid })
                });
                if (!response.ok) throw new Error('Complete failed');
                alert("تمت العملية بنجاح! تفقد لوحة التحكم الآن ✅");
            },
            
            onCancel: (paymentId) => console.log("تم إلغاء الدفع"),
            onError: (error, payment) => {
                console.error("خطأ في الدفع:", error);
                document.getElementById('status-text').innerText = 'فشل في إتمام الدفع ❌';
            }
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}

// 4. دالة معالجة العمليات غير المكتملة - مصححة
function onIncompletePaymentFound(payment) {
    console.log("وجدت عملية معلقة:", payment);
    // لازم ترجع promise عشان الـ SDK يكمل
    return fetch(`${SERVER_URL}/payments/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            paymentId: payment.identifier,
            txid: payment.transaction.txid
        })
    });
}

// 5. دالة الاشتراك - ضيفها لو تبيها
async function startSubscription() {
    try {
        const paymentData = {
            amount: 5,
            memo: "Charge Union Monthly Subscription",
            metadata: { type: "subscription", plan: "PiRC2" }
        };

        const callbacks = {
            onReadyForServerApproval: async (paymentId) => {
                const response = await fetch(`${SERVER_URL}/payments/approve`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                });
                if (!response.ok) throw new Error('Approve failed');
            },
            onReadyForServerCompletion: async (paymentId, txid) => {
                const response = await fetch(`${SERVER_URL}/payments/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId, txid })
                });
                if (!response.ok) throw new Error('Complete failed');
                alert("تم تفعيل الاشتراك بنجاح 🚀");
            },
            onCancel: (paymentId) => console.log("تم إلغاء الاشتراك"),
            onError: (error, payment) => {
                console.error("خطأ في الاشتراك:", error);
                document.getElementById('status-text').innerText = 'فشل تفعيل الاشتراك ❌';
            }
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}
