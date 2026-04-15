// تهيئة Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

async function login() {
    const scopes = ['username', 'payments'];
    try {
        const user = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        // تحديث الواجهة بعد نجاح الدخول
        document.getElementById('username').innerText = user.username;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('pay-btn').style.display = 'block';
        document.getElementById('status-text').innerText = "تم تسجيل الدخول بنجاح";
        
    } catch (error) {
        console.error(error);
        alert("فشل تسجيل الدخول. تأكد من فتح التطبيق من Pi Browser.");
    }
}

async function makePayment() {
    try {
        const paymentData = {
            amount: 1,
            memo: "تجربة دفع في Charger Union",
            metadata: { test: true }
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => console.log("بانتظار الموافقة:", paymentId),
            onReadyForServerCompletion: (paymentId) => console.log("بانتظار الإتمام:", paymentId),
            onCancel: (paymentId) => console.log("تم الإلغاء:", paymentId),
            onError: (error) => console.error("خطأ:", error)
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}

function onIncompletePaymentFound(payment) {
    console.log("دفعة غير مكتملة:", payment);
}
