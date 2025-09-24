# 🔌 ChargeUnion API Reference

هذا المرجع يشرح نقاط الاتصال البرمجية المتاحة داخل ChargeUnion، ويُستخدم لربط التطبيق بمنصات خارجية، أو لتطوير واجهات مخصصة.

---

## 🧾 Authentication

### `POST /api/auth/login`
- **الوصف**: تسجيل دخول المستخدم
- **المعطيات**:
  - `email`: البريد الإلكتروني
  - `password`: كلمة المرور
- **الاستجابة**:
  - `token`: رمز الجلسة

### `POST /api/auth/logout`
- **الوصف**: إنهاء الجلسة الحالية
- **المعطيات**: `token`
- **الاستجابة**: `success: true`

---

## 📍 Charging Stations

### `GET /api/stations/nearby`
- **الوصف**: جلب المحطات القريبة من الموقع الحالي
- **المعطيات**:
  - `latitude`
  - `longitude`
- **الاستجابة**: قائمة بالمحطات مع التفاصيل

### `POST /api/stations/report`
- **الوصف**: الإبلاغ عن مشكلة في محطة
- **المعطيات**:
  - `station_id`
  - `issue_type`
  - `description`
- **الاستجابة**: `status: received`

---

## 💳 Payments

### `POST /api/payments/initiate`
- **الوصف**: بدء عملية دفع
- **المعطيات**:
  - `amount`
  - `currency`
  - `method` (مثل: Pi, Stripe)
- **الاستجابة**: `payment_url`

---

## 🌐 Translations

### `GET /api/translations/{lang}`
- **الوصف**: جلب الترجمة للواجهة بلغة معينة
- **المعطيات**: `lang` (مثل: ar, fr, en)
- **الاستجابة**: ملف JSON بالترجمة

---

## 🧭 Metadata

### `GET /api/meta/version`
- **الوصف**: جلب رقم إصدار التطبيق الحالي
- **الاستجابة**: `version: 1.4.0`

---

> الإصدار: 1.4  
> المصدر: ChargeUnion API Documentation
