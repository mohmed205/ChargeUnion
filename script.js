// تهيئة Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

async function login() {
    const scopes = ['username', 'payments'];
    try {
        // المصادقة مع الشبكة
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        // إصلاح مشكلة undefined باستخراج الاسم بشكل صحيح
        const userDisplayName = auth.user.username;
        
        // تحديث واجهة التطبيق
        document.getElementById('username').innerText = "@" + userDisplayName;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('pay-btn').style.display = 'block';
        document.getElementById('status-text').innerText = "تم الاتصال بنجاح ✅";
        
        console.log("مرحباً بك يا عمار:", userDisplayName);
    } catch (error) {
        console.error("خطأ:", error);
        alert("فشل تسجيل الدخول. تأكد من فتح الرابط داخل Pi Browser");
    }
}

async function makePayment() {
    try {
        const paymentData = {
            amount: 1,
            memo: "شحن رصيد Charger Union",
            metadata: { user: "mohmed205" }
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => {
                alert("تم إرسال الطلب للمحفظة! رقم العملية: " + paymentId);
            },
            onReadyForServerCompletion: (paymentId) => {
                console.log("بانتظار التأكيد النهائي...");
            },
            onCancel: (paymentId) => console.log("تم إلغاء الدفع"),
            onError: (error) => console.error("خطأ في الدفع:", error)
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}

function onIncompletePaymentFound(payment) {
    console.log("هناك عملية معلقة:", payment);
}
