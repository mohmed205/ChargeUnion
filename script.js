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
        
        console.log("بيانات المستخدم:", user);
    } catch (error) {
        console.error(error);
        alert("فشل تسجيل الدخول: " + error.message);
    }
}

async function makePayment() {
    try {
        const paymentData = {
            amount: 1, // جرب تغيير المبلغ هنا إذا أردت
            memo: "تجربة دفع في Charger Union",
            metadata: { test: true }
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => {
                console.log("تمت موافقة المستخدم، رقم العملية:", paymentId);
                // هذه الرسالة ستؤكد لك أن الكود سليم قبل أن تظهر رسالة "الانتهاء"
                alert("تم إرسال الطلب بنجاح! رقم العملية: " + paymentId);
            },
            onReadyForServerCompletion: (paymentId) => {
                console.log("العملية تنتظر الإتمام النهائي:", paymentId);
            },
            onCancel: (paymentId) => {
                console.log("تم إلغاء الدفع من قبل المستخدم");
            },
            onError: (error, payment) => {
                console.error("خطأ أثناء الدفع:", error);
                alert("حدث خطأ في عملية الدفع.");
            }
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}

function onIncompletePaymentFound(payment) {
    console.log("تم العثور على دفعة لم تكتمل سابقاً:", payment);
    // يمكنك هنا إخبار المستخدم أن لديه عملية معلقة
            }
