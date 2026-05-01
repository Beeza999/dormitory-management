# ບີຫ້ອງເຊົ່າ Frontend

Frontend ນີ້ສ້າງດ້ວຍ React JS + Vite + Tailwind CSS ແລະເຊື່ອມກັບ backend ທີ່ທ່ານສົ່ງມາ.

## ໜ້າທີ່ທີ່ມີແລ້ວ

### Phase 1
- Login Page
- Auth Store (Zustand)
- Axios API Base + Interceptor
- Route Guard (AdminRoute / UserRoute / GuestRoute)

### Phase 2
- Admin Layout
- User Layout

### Phase 3
#### User
- Dashboard
- Bills
- Payment Upload Slip
- History
- Notifications
- Chat
- Profile

#### Admin
- Dashboard
- Rooms CRUD
- Tenants CRUD
- Billing Create/List
- Payments Review
- Announcements
- Chat
- Reports
- Settings

## ຕິດຕັ້ງ

1. ແຕກ zip frontend
2. ເປີດ terminal ໃນ folder project
3. ຄັດລອກ `.env.example` ເປັນ `.env`
4. ແກ້ໄຂ URL ໃຫ້ກົງກັບ backend
5. ລົງ package
6. ເປີດ dev server

```bash
npm install
npm run dev
```

## ຄ່າ env

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_ROOT=http://localhost:5000
```

## ໝາຍເຫດ
- backend ຄວນເປີດ CORS ໃຫ້ frontend
- ຮູບ slip ຈະໂຫລດຈາກ `VITE_API_ROOT + slipImage`
- ໜ້າ user chat ພະຍາຍາມຫາ admin ຈາກ announcement ລ່າສຸດ ເນື່ອງຈາກ backend ບໍ່ມີ route ສຳລັບ list admin ໂດຍກົງ

## Build production

```bash
npm run build
```

