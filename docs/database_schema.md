# 🗄️ ChargeUnion Database Schema

هذا المرجع يشرح هيكل قاعدة البيانات المستخدمة داخل ChargeUnion، ويُعتبر أساسًا لأي تطوير، تحليل، أو ربط خارجي.

---

## 📦 الجداول الأساسية

### `users`
- `id` (INT, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (TEXT)
- `language` (VARCHAR)
- `created_at` (TIMESTAMP)

### `stations`
- `id` (INT, PK)
- `name` (VARCHAR)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `status` (ENUM: active, inactive, reported)
- `added_by` (FK → users.id)

### `charges`
- `id` (INT, PK)
- `user_id` (FK → users.id)
- `station_id` (FK → stations.id)
- `start_time` (TIMESTAMP)
- `end_time` (TIMESTAMP)
- `energy_kwh` (FLOAT)
- `payment_id` (FK → payments.id)

### `payments`
- `id` (INT, PK)
- `user_id` (FK → users.id)
- `amount` (FLOAT)
- `currency` (VARCHAR)
- `method` (VARCHAR)
- `status` (ENUM: pending, completed, failed)
- `timestamp` (TIMESTAMP)

### `translations`
- `id` (INT, PK)
- `key` (VARCHAR)
- `language` (VARCHAR)
- `value` (TEXT)

### `nfts`
- `id` (INT, PK)
- `user_id` (FK → users.id)
- `type` (VARCHAR)
- `metadata` (JSON)
- `created_at` (TIMESTAMP)

---

## 🔗 العلاقات

- كل مستخدم يمكنه إضافة محطات، إجراء شحنات، ودفع عبر أكثر من طريقة  
- كل شحنة ترتبط بمحطة ومستخدم ودفع  
- كل NFT يرتبط بمستخدم ويُوثّق لحظة شعائرية

---

> الإصدار: 1.4  
> المصدر: ChargeUnion Database Documentation
