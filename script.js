// تهيئة Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

async function login() {
    const scopes = ['username', 'payments'];
    try {
        // المصادقة مع الشبكة
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        // استخراج اسم المستخدم
        const userDisplayName = auth.user.username;
        
        // تحديث واجهة التطبيق
        document.getElementById('username').innerText = "@" + userDisplayName;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('pay-btn').style.display = 'block';
        document.getElementById('status-text').innerText = "تم الاتصال بنجاح ✅";
        
        console.log("مرحباً بك:", userDisplayName);
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
            onReadyForServerApproval: async (paymentId) => {
                console.log("إرسال رقم العملية للموافقة إلى Render:", paymentId);
                
                // رابط خادمك الجديد على Render
                const serverUrl = "https://mohmed205-github-io.onrender.com/approve-payment";

                try {
                    const response = await fetch(serverUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentId: paymentId })
                    });

                    const result = await response.json();
                    
                    if (response.ok) {
                        console.log("وافق الخادم بنجاح:", result);
                        // إخبار الـ SDK بأن السيرفر وافق
                        return Pi.payment.complete(paymentId);
                    } else {
                        console.error("فشل الخادم في الموافقة");
                    }
                } catch (error) {
                    console.error("خطأ في الاتصال بالخادم:", error);
                }
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log("العملية اكتملت بنجاح! TXID:", txid);
                alert("تمت العملية بنجاح! شكرًا لك.");
            },
            onCancel: (paymentId) => {
                console.log("تم إلغاء الدفع من قبل المستخدم");
            },
            onError: (error, payment) => {
                console.error("خطأ في الدفع:", error);
                alert("حدث خطأ أثناء الدفع، حاول مرة أخرى.");
            }
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error("خطأ في إنشاء عملية الدفع:", error);
    }
}

function onIncompletePaymentFound(payment) {
    console.log("هناك عملية معلقة يجب معالجتها:", payment);
    // يمكنك هنا استدعاء خادمك لإكمال العملية إذا كانت معلقة
}
