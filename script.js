// تهيئة Pi SDK
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

// عنوان العقد الذكي للاشتراكات (من صورك)
const SUBSCRIPTION_CONTRACT_ID = "CCUF75B6W3HRTJD6O7OXNI72HGJ7DERZ5MUNOMFMSK23ME5GUIKPFYV";

async function login() {
    const scopes = ['username', 'payments', 'subscriptions']; // أضفنا صلاحية الاشتراكات
    try {
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        const userDisplayName = auth.user.username;
        
        document.getElementById('username').innerText = "@" + userDisplayName;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        
        // إظهار أزرار الدفع والاشتراك
        document.getElementById('pay-btn').style.display = 'block';
        document.getElementById('sub-btn').style.display = 'block'; 
        
        document.getElementById('status-text').innerText = "تم الاتصال بنجاح ✅";
    } catch (error) {
        console.error("خطأ:", error);
        alert("فشل تسجيل الدخول. تأكد من فتح الرابط داخل Pi Browser");
    }
}

// --- دالة الاشتراك الجديدة (أول ربط للمرحلة العاشرة) ---
async function startSubscription() {
    try {
        const paymentData = {
            amount: 0.5, // مبلغ بسيط للاشتراك التجريبي
            memo: "تفعيل اشتراك Charge Union الدوري",
            metadata: { 
                contract_address: SUBSCRIPTION_CONTRACT_ID,
                type: "subscription_init" 
            }
        };

        const callbacks = {
            onReadyForServerApproval: async (paymentId) => {
                return handleServerApproval(paymentId); // نستخدم نفس دالة الموافقة
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log("تم تفعيل الاشتراك بنجاح! TXID:", txid);
                alert("تم تفعيل نظام الاشتراك ✅ - هذا سيساعد في المرحلة العاشرة!");
            },
            onCancel: (paymentId) => console.log("تم الإلغاء"),
            onError: (error) => alert("خطأ في الاشتراك، تأكد أن السيرفر Live")
        };

        await Pi.createPayment(paymentData, callbacks);
    } catch (error) {
        console.error(error);
    }
}

// دالة مشتركة للموافقة عبر Render
async function handleServerApproval(paymentId) {
    const serverUrl = "https://mohmed205-github-io.onrender.com/approve-payment";
    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: paymentId })
        });
        if (response.ok) {
            return Pi.payment.complete(paymentId);
        }
    } catch (error) {
        console.error("السيرفر لا يستجيب:", error);
    }
}

// دالة الدفع العادي (التي كتبتها أنت)
async function makePayment() {
    // ... (نفس الكود الذي كتبته أنت أعلاه)
}

function onIncompletePaymentFound(payment) {
    console.log("عملية معلقة:", payment);
}
