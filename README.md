# 🚗 LimoGo - Ứng dụng đặt xe xanh

Ứng dụng web đặt xe điện tương tự **Green SM/Xanh SM** với giao diện mobile-first, backend Supabase và các tính năng thật.

## 🎯 Tính năng chính

### 🎫 Đặt xe
- ✅ Nhập điểm đón/đến với gợi ý địa điểm
- ✅ Chọn giữa Đi ngay hoặc Đặt lịch
- ✅ Hiển thị bản đồ với Leaflet + OpenStreetMap
- ✅ Tính khoảng cách và giá tự động
- ✅ 3 loại xe: Tiêu chuẩn, Cao cấp, 7 chỗ
- ✅ Chọn phương thức thanh toán: Tiền mặt, Ví, Thẻ, MoMo
- ✅ Áp dụng mã giảm giá (ví dụ: `XANH30`)

### 👤 Tài khoản
- ✅ Đăng ký/Đăng nhập với Supabase Auth
- ✅ Quản lý hồ sơ cá nhân
- ✅ Xem ví LimoGo (số dư, điểm thưởng)
- ✅ Lịch sử chuyến xe đầy đủ
- ✅ Hỗ trợ khách hàng

### 🚕 Theo dõi chuyến
- ✅ Bản đồ realtime vị trí tài xế
- ✅ ETA (Thời gian dự kiến)
- ✅ Trạng thái chuyến chi tiết
- ✅ Gọi tài xế, nhắn tin, chia sẻ chuyến
- ✅ Hủy chuyến nếu cần

### 💳 Thanh toán & Giao dịch
- ✅ Lưu giao dịch thanh toán
- ✅ Lịch sử chi tiết theo chuyến
- ✅ Tích lũy điểm thưởng

### ⭐ Đánh giá
- ✅ Đánh giá chuyến sau hoàn thành
- ✅ Viết review cho tài xế
- ✅ Realtime cập nhật

## 📁 Cấu trúc thư mục

```
timenew/
├── index.html                 # Trang chính (đặt xe)
├── style.css                  # Style chính
├── script.js                  # JavaScript chính
│
├── js/
│   ├── supabase-config.js     # Cấu hình Supabase URL & Key
│   ├── supabase-client.js     # Khởi tạo Supabase client
│   ├── pages.js               # Xử lý dữ liệu cho các page
│   ├── realtime.js            # Realtime subscriptions
│   ├── payment.js             # Xử lý thanh toán & ví
│   └── rating.js              # Xử lý đánh giá chuyến
│
├── pages/
│   ├── wallet.html            # Trang Ví LimoGo
│   ├── history.html           # Trang Lịch sử chuyến
│   ├── account.html           # Trang Tài khoản
│   ├── support.html           # Trang Hỗ trợ
│   └── ride-detail.html       # Trang Chi tiết chuyến
│
├── styles/
│   └── pages.css              # CSS cho các page
│
└── supabase/
    └── schema.sql             # Schema database
```

## 🔧 Cài đặt & Chạy

### 1. Yêu cầu
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Tài khoản Supabase (https://supabase.com)

### 2. Cấu hình Supabase

1. **Tạo dự án Supabase**
   - Đăng nhập hoặc tạo tài khoản Supabase
   - Tạo một dự án mới
   - Lấy **Project URL** và **Anon Public Key**

2. **Chạy schema SQL**
   - Vào Supabase Dashboard → SQL Editor
   - Tạo query mới
   - Copy toàn bộ nội dung từ `supabase/schema.sql`
   - Paste vào SQL Editor và chạy

3. **Cấu hình API Keys**
   - Copy **Project URL** từ Supabase Settings → API
   - Copy **Anon Public Key** từ Supabase Settings → API
   - Mở file `js/supabase-config.js`
   - Cập nhật:
     ```javascript
     export const SUPABASE_URL = "https://your-project.supabase.co";
     export const SUPABASE_ANON_KEY = "your-anon-key-here";
     ```

### 3. Chạy ứng dụng

**Cách 1: Dùng Python (đơn giản nhất)**
```bash
cd /path/to/timenew
python -m http.server 8000
# Mở trình duyệt: http://localhost:8000
```

**Cách 2: Dùng Node.js**
```bash
cd /path/to/timenew
npx http-server -p 8000
# Mở trình duyệt: http://localhost:8000
```

**Cách 3: Dùng VS Code Live Server**
- Cài extension "Live Server"
- Chuột phải → "Open with Live Server"

## 📊 Cấu trúc Database

### Bảng `users` (Supabase Auth)
- Được tạo tự động bởi Supabase
- Chứa email, mật khẩu (mã hóa)

### Bảng `profiles`
```sql
- id (UUID, khóa chính)
- full_name (text)
- phone (text)
- wallet_balance (numeric, default: 0)
- reward_points (integer, default: 0)
- membership (text, default: "Green Member")
- avatar_url (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Bảng `drivers`
```sql
- id (UUID, khóa chính)
- driver_name (text)
- phone (text)
- vehicle_license_plate (text)
- vehicle_type (text)
- status (enum: "available", "busy", "offline")
- current_latitude (numeric)
- current_longitude (numeric)
- rating (numeric)
- reviews_count (integer)
- created_at (timestamp)
```

### Bảng `rides`
```sql
- id (UUID, khóa chính)
- user_id (UUID, khóa ngoài → users)
- driver_id (UUID, khóa ngoài → drivers)
- pickup_address (text)
- destination_address (text)
- pickup_lat/lng (numeric)
- destination_lat/lng (numeric)
- distance_km (numeric)
- vehicle_type (text)
- payment_method (text: "cash", "wallet", "card", "momo")
- promo_code (text)
- subtotal (numeric)
- discount (numeric)
- total (numeric)
- status (enum: "searching", "driver_assigned", "driver_arriving", "arrived", "in_progress", "completed", "cancelled")
- rating (integer 1-5)
- review (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Bảng `payments`
```sql
- id (UUID, khóa chính)
- user_id (UUID, khóa ngoài)
- ride_id (UUID, khóa ngoài)
- amount (numeric)
- payment_method (text)
- status (text: "pending", "completed", "failed")
- transaction_id (text)
- created_at (timestamp)
```

### Bảng `promo_codes`
```sql
- id (UUID, khóa chính)
- code (text, unique)
- discount_percent (numeric)
- max_discount (numeric)
- expiry_date (timestamp)
- is_active (boolean)
```

## 🔐 Row Level Security (RLS)

Tất cả các bảng đều có **RLS Policies** để bảo vệ dữ liệu:

- **User chỉ xem/sửa dữ liệu của chính mình**
- **Driver chỉ xem dữ liệu chuyến được gán cho mình**
- **Promo codes có thể xem công khai nhưng chỉ update bởi admin**

## 🚀 Các API & Functions

### Authentication (`js/supabase-client.js`)
```javascript
await window.limoGoSupabase.auth.signUp({ email, password })
await window.limoGoSupabase.auth.signInWithPassword({ email, password })
await window.limoGoSupabase.auth.signOut()
```

### Profiles (`js/pages.js`)
```javascript
await loadProfile(user)        // Lấy hồ sơ người dùng
await updateWalletBalance()    // Cập nhật số dư ví
await addRewardPoints()        // Tích điểm
```

### Rides (trong `script.js`)
```javascript
await window.limoGoSupabase.from("rides").insert({...})  // Tạo chuyến mới
```

### Payments (`js/payment.js`)
```javascript
await savePayment(rideId, amount, method)       // Lưu thanh toán
await getPaymentHistory(userId)                 // Lấy lịch sử
```

### Ratings (`js/rating.js`)
```javascript
await submitRideRating(rideId, rating, review)  // Đánh giá chuyến
```

### Realtime (`js/realtime.js`)
```javascript
subscribeToActiveRide(userId, rideId, callback) // Subscribe cập nhật chuyến
subscribeToDriver(driverId, callback)           // Subscribe vị trí tài xế
```

## 📱 Giao diện Mobile-First

- **Responsive Design**: Tối ưu cho mobile, tablet, desktop
- **Bottom Navigation**: 4 tab chính (Đặt xe, Bản đồ, Ưu đãi, Tài khoản)
- **Mobile App Bar**: Hiển thị tên người dùng và thông báo
- **Touch-friendly**: Nút bấm lớn, khoảng cách tốt

## 🔄 Luồng sử dụng

1. **Khách vô danh** → Xem giao diện → Nhập địa chỉ → Chọn xe → **Phải đăng nhập**
2. **Đăng ký** → Email + Mật khẩu → Tạo hồ sơ tự động → **Đã đăng nhập**
3. **Đăng nhập** → Email + Mật khẩu → Khôi phục phiên → **Đã đăng nhập**
4. **Đặt xe** → Chọn các thông số → Xác nhận → **Lưu vào Supabase**
5. **Thanh toán** → Chọn phương thức → Lưu giao dịch → **Cộng điểm**
6. **Theo dõi** → Xem bản đồ realtime → ETA → Hoàn thành → **Yêu cầu đánh giá**
7. **Đánh giá** → Chọn sao + review → **Lưu đánh giá**

## 🌍 Mã giảm giá Demo

| Mã        | Giảm    | Tối đa  |
|-----------|---------|---------|
| XANH30    | 30%     | 30.000đ |

Thêm mã mới: Đặt vào bảng `promo_codes` trong Supabase

## 🎨 Giao diện

- **Font**: Be Vietnam Pro (Google Fonts)
- **Màu chính**: `#1ba969` (Xanh LimoGo)
- **Màu phụ**: `#f7f7f7` (Nền), `#8a9994` (Text nhẹ)
- **Layout**: Mobile-first, flexbox, CSS Grid

## 🚧 Phát triển tiếp theo

### Priority 1 (Cần ngay)
- [ ] Kết nối Google Maps API (hoặc Maps Platform)
- [ ] Thanh toán thực tế (MoMo, VNPay, Stripe)
- [ ] Cập nhật vị trí tài xế thực tế (GPS)
- [ ] Notification push (Firebase Cloud Messaging)

### Priority 2 (Nâng cấp)
- [ ] Tạo admin dashboard (xem chuyến, tài xế, doanh thu)
- [ ] Backend Edge Function (xác thực thanh toán, gán tài xế)
- [ ] Chat realtime (Socket.io hoặc Supabase Realtime)
- [ ] Widget đánh giá/review

### Priority 3 (Tối ưu)
- [ ] Offline-first (Service Worker + IndexedDB)
- [ ] Native app (React Native, Flutter)
- [ ] Multi-language support
- [ ] Dark mode

## 🐛 Troubleshooting

### Bản đồ không hiển thị
- Kiểm tra lại cấu hình Supabase
- Bật JS trong trình duyệt
- Xóa cache: Ctrl+Shift+Delete

### Không đăng nhập được
- Kiểm tra email/mật khẩu đúng
- Đảm bảo đã chạy `schema.sql`
- Mở Developer Console (F12) xem lỗi

### Chuyến không lưu được
- Kiểm tra đã đăng nhập
- Mở Developer Console xem lỗi Supabase
- Kiểm tra RLS Policies

### Giao diện bị lỗi
- F5 để reload
- Xóa cache trình duyệt
- Kiểm tra kết nối internet

## 📞 Hỗ trợ

- **Issues**: GitHub Issues (nếu có repo)
- **Email**: support@limogo.local
- **Chat**: Messenger hoặc Telegram

## 📄 Giấy phép

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Made with ❤️ for Green Transportation** 🌱
