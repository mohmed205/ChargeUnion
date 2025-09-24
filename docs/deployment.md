# 🚀 نشر تطبيق ChargeUnion

يوضح هذا الدليل خطوات نشر تطبيق ChargeUnion على بيئة الإنتاج، ويضمن تشغيله بكفاءة وأمان.

---

## 🧾 المتطلبات الأساسية

- خادم Linux (Ubuntu 22.04 أو أحدث)  
- Node.js (v18+)  
- قاعدة بيانات PostgreSQL  
- Redis (لإدارة الجلسات)  
- Docker (اختياري للتغليف الكامل)  
- شهادة SSL (Let's Encrypt أو مدفوعة)

---

## 🛠️ خطوات النشر

1. **إعداد الخادم**
   - تحديث النظام: `sudo apt update && sudo apt upgrade`
   - تثبيت الأدوات الأساسية: `git`, `nginx`, `certbot`

2. **نسخ المشروع**
   - `git clone https://github.com/chargeunion/app.git`
   - إعداد ملفات البيئة `.env`

3. **تثبيت الحزم**
   - `npm install`  
   - إعداد قاعدة البيانات: `npm run migrate`

4. **تشغيل التطبيق**
   - `npm run build`  
   - `pm2 start ecosystem.config.js`

5. **إعداد Nginx**
   - توجيه الطلبات إلى التطبيق  
   - تفعيل HTTPS عبر Certbot

6. **مراقبة الأداء**
   - استخدام `pm2 monit`  
   - إعداد تنبيهات عبر البريد أو Telegram

---

## 📦 نقاط API المرتبطة

### `GET /api/meta/status`
- التحقق من حالة التطبيق

### `POST /api/admin/restart`
- إعادة تشغيل التطبيق (للمشرفين فقط)

---

## 🧭 فلسفة النشر

النشر ليس مجرد رفع ملفات، بل طقس رقمي يُعلن ولادة نسخة جديدة من المشروع، ويُخلّد لحظة عبور من التطوير إلى الحياة العامة.

---

> الإصدار: 1.4  
> المصدر: ChargeUnion Deployment Documentation
