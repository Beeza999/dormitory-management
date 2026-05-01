# Dormitory Backend

Backend สำหรับระบบจัดการหอพัก แยกฝั่ง Admin และ User ชัดเจน

## ฟีเจอร์หลัก
- Auth: register, login, me, logout
- Admin dashboard และ reports
- Rooms CRUD
- Tenants CRUD
- Bills CRUD + bills ของผู้เช่า
- Upload slip + approve/reject payment
- Announcements
- Notifications
- Chat API + socket realtime เบื้องต้น

## โครงสร้างไฟล์
```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── announcement.controller.js
│   │   ├── auth.controller.js
│   │   ├── bill.controller.js
│   │   ├── chat.controller.js
│   │   ├── payment.controller.js
│   │   ├── room.controller.js
│   │   ├── tenant.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── Announcement.js
│   │   ├── Bill.js
│   │   ├── Chat.js
│   │   ├── Notification.js
│   │   ├── Payment.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── announcement.routes.js
│   │   ├── auth.routes.js
│   │   ├── bill.routes.js
│   │   ├── chat.routes.js
│   │   ├── payment.routes.js
│   │   ├── room.routes.js
│   │   ├── tenant.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── bill.service.js
│   │   ├── chat.service.js
│   │   ├── notification.service.js
│   │   └── payment.service.js
│   ├── sockets/
│   │   └── chat.socket.js
│   ├── utils/
│   │   ├── buildAdminDashboard.js
│   │   └── generateToken.js
│   ├── app.js
│   └── server.js
├── uploads/
├── .env.example
├── .gitignore
├── package.json
└── README_TH.md
```

## ขั้นตอนติดตั้งทีละขั้นตอน

### 1) แตกไฟล์ zip
แตกไฟล์ไปที่โฟลเดอร์ที่ต้องการ เช่น
```bash
E:\dormitory-management\backend
```

### 2) เปิด terminal ในโฟลเดอร์ backend
```bash
cd E:\dormitory-management\backend
```

### 3) ติดตั้ง dependencies
```bash
npm install
```

### 4) สร้างไฟล์ .env
คัดลอก `.env.example` เป็น `.env`

บน Windows PowerShell:
```powershell
copy .env.example .env
```

หรือสร้างเองแล้ววางค่าแบบนี้
```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/dormitory_db?retryWrites=true&w=majority
JWT_SECRET=supersecretkey
CLIENT_URL=http://localhost:5173
```

### 5) เตรียม MongoDB Atlas
- สร้าง Database User
- เปิด IP Access เป็น `0.0.0.0/0`
- เอา connection string มาใส่ใน `MONGO_URI`
- เปลี่ยน `USERNAME` และ `PASSWORD` เป็นของจริง

### 6) รันโปรเจก
```bash
npm run dev
```

ถ้าถูกต้องจะขึ้นประมาณนี้
```bash
MongoDB connected
Server running on port 5000
```

### 7) ทดสอบหน้าแรก
เปิดเบราว์เซอร์
```text
http://localhost:5000/
```
จะได้ JSON ว่า API ทำงานอยู่

## API หลัก

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/reports`

### Rooms
- `GET /api/rooms`
- `POST /api/rooms`
- `GET /api/rooms/:id`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`

### Tenants
- `GET /api/tenants`
- `POST /api/tenants`
- `GET /api/tenants/:id`
- `PUT /api/tenants/:id`
- `DELETE /api/tenants/:id`

### Bills
- `GET /api/bills`
- `POST /api/bills`
- `GET /api/bills/:id`
- `PUT /api/bills/:id`
- `GET /api/bills/my/list`
- `GET /api/bills/my/history`

### Payments
- `POST /api/payments/upload-slip`
- `GET /api/payments`
- `PATCH /api/payments/:id/approve`
- `PATCH /api/payments/:id/reject`

### Announcements
- `GET /api/announcements`
- `POST /api/announcements`

### User
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/notifications`
- `PATCH /api/user/notifications/:id/read`

### Chat
- `GET /api/chat/:userId`
- `POST /api/chat/send`

## ลำดับที่ควรเริ่มใช้จริง
1. Register admin 1 คน
2. Login admin
3. สร้างห้อง
4. สร้าง tenant
5. สร้าง bill
6. Login user
7. อัปโหลด slip
8. Login admin เพื่อ approve payment
9. ดู notifications และ chat

## หมายเหตุสำคัญ
- route ส่วนใหญ่ต้องส่ง header แบบนี้
```text
Authorization: Bearer YOUR_TOKEN
```
- การอัปโหลดสลิปใช้ `form-data`
- key รูปคือ `slipImage`
- ฝั่ง user ใช้ role `user`
- ฝั่ง admin ใช้ role `admin`

## สิ่งที่มีให้แล้วในชุดนี้
- โครงสร้าง backend ครบ
- model ครบตามระบบหลัก
- middleware auth/role/error/upload
- service แยก business logic สำคัญ
- API routes ครบสำหรับเริ่มทำ frontend ต่อ
- socket chat เบื้องต้น

## สิ่งที่คุณอาจเพิ่มต่อภายหลัง
- validation ระดับลึกด้วย Joi/Zod
- refresh token
- forgot password
- pagination/filter/search
- unit tests
- cloud storage สำหรับรูป slip
- log และ audit trail
