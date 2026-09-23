# 🎯 LimoGo - Hướng dẫn triển khai (Deployment Guide)

## 📌 Tổng quan

LimoGo là một ứng dụng web đặt xe điện tương tự Green SM/Xanh SM với:
- ✅ Frontend: HTML, CSS, JavaScript (Vanilla)
- ✅ Backend: Supabase (PostgreSQL + Auth)
- ✅ Realtime: Supabase Realtime subscriptions
- ✅ UI: Mobile-first responsive design
- ✅ Maps: Leaflet + OpenStreetMap

**Phiên bản hiện tại:** v2.0.0

---

## 🚀 Khởi động nhanh (30 phút)

### 1️⃣ Clone/Download dự án
```bash
git clone <repo-url> timenew
cd timenew
```

### 2️⃣ Cấu hình Supabase (5 phút)
- Xem file: `QUICKSTART.html`
- Hoặc đọc: `SUPABASE_SETUP.md`

### 3️⃣ Cập nhật API keys
- Mở: `js/supabase-config.js`
- Thay Project URL + Anon Key

### 4️⃣ Chạy server
```bash
python -m http.server 8000
# Hoặc: npx http-server -p 8000
```

### 5️⃣ Truy cập
```
http://localhost:8000
```

---

## 📂 Cấu trúc dự án

```
timenew/
├── 📄 index.html              ← Trang chính (đặt xe)
├── 🎨 style.css               ← CSS chính
├── ⚙️  script.js              ← JavaScript chính
│
├── 📁 js/
│   ├── supabase-config.js      ← ⭐ CẤU HÌNH API KEYS ở đây
│   ├── supabase-client.js      ← Khởi tạo Supabase
│   ├── pages.js                ← Xử lý data cho các page
│   ├── realtime.js             ← Realtime subscriptions
│   ├── payment.js              ← Thanh toán & ví
│   └── rating.js               ← Đánh giá chuyến
│
├── 📁 pages/
│   ├── wallet.html             ← Trang Ví
│   ├── history.html            ← Trang Lịch sử
│   ├── account.html            ← Trang Tài khoản
│   ├── support.html            ← Trang Hỗ trợ
│   └── ride-detail.html        ← Trang Chi tiết chuyến
│
├── 📁 styles/
│   └── pages.css               ← CSS cho pages
│
├── 📁 supabase/
│   └── schema.sql              ← ⭐ SQL cần chạy trong Supabase
│
├── 📄 README.md                ← Tài liệu chính
├── 📄 SUPABASE_SETUP.md        ← Hướng dẫn Supabase chi tiết
├── 📄 QUICKSTART.html          ← Quick start 8 bước
├── 📄 DEPLOYMENT.md            ← File này
└── 📄 CHANGELOG.md             ← Lịch sử cập nhật
```

---

## ⚙️ Các bước cấu hình chi tiết

### 1. Tạo tài khoản Supabase
- Truy cập: https://supabase.com
- Đăng ký bằng GitHub hoặc Email
- Xác thực email

### 2. Tạo dự án
- New Project → Tên: `limogo`
- Database Password: Ghi nhớ
- Region: Singapore (gần VN)
- Chờ 5-10 phút

### 3. Lấy API Keys
- Settings → API
- Sao chép **Project URL** (ví dụ: `https://xxxxx.supabase.co`)
- Sao chép **Anon Public Key** (bắt đầu `eyJh...`)

### 4. Cập nhật config
Mở `js/supabase-config.js`:
```javascript
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGc...";
```

### 5. Chạy SQL Schema
- SQL Editor → New Query
- Copy toàn bộ `supabase/schema.sql`
- Paste vào SQL Editor
- Run (Ctrl+Enter)
- Chờ "Command completed successfully"

### 6. Kiểm tra Database
- Table Editor → Kiểm tra 5 bảng được tạo:
  - `profiles` ✓
  - `drivers` ✓
  - `rides` ✓
  - `payments` ✓
  - `promo_codes` ✓

---

## 🎮 Test tính năng

### ✅ Auth (Đăng ký/Đăng nhập)
```
1. Click "Đăng nhập" (góc phải)
2. Click "Đăng ký"
3. Nhập: Tên, Email, Mật khẩu (6+ ký tự)
4. Click "Đăng ký"
5. ✓ Thấy "✓ Đăng ký thành công!"
```

### ✅ Booking (Đặt xe)
```
1. Trang chủ
2. Nhập: "Vị trí hiện tại" → "Landmark 81"
3. Chọn: Xe tiêu chuẩn
4. Mã giảm giá: XANH30 (optional)
5. Click: "Xác nhận đặt xe"
6. ✓ Thấy hóa đơn + thông báo thành công
```

### ✅ Database
```
1. Supabase → Table Editor
2. Chọn bảng "rides"
3. ✓ Thấy 1 chuyến vừa đặt
```

### ✅ Pages (Lịch sử/Ví/Tài khoản)
```
1. Bottom nav → "Lịch sử" / "Ví" / "Tài khoản"
2. ✓ Dữ liệu load từ Supabase
3. ✓ Hiển thị chuyến/ví/profile thật
```

---

## 🌐 Triển khai lên Production

### Option 1: Netlify (Dễ nhất)
```bash
npm install -g netlify-cli
netlify deploy
```

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

### Option 3: GitHub Pages
```bash
git push origin main
# Vào Settings → Pages → Deploy from branch
```

### Option 4: Server riêng (DigitalOcean, AWS, Heroku)
```bash
# Copy toàn bộ thư mục lên server
scp -r timenew/ user@server:/var/www/
```

---

## 🔐 Bảo mật Production

### ✅ API Keys
- [ ] Dùng **Anon Public Key** trên frontend
- [ ] KHÔNG commit credentials vào Git
- [ ] Dùng environment variables nếu cần

### ✅ RLS Policies
- [ ] Enable RLS trên tất cả bảng
- [ ] Kiểm tra policies:
  ```sql
  SELECT * FROM auth.policies;
  ```
- [ ] Chỉ user được xem dữ liệu của chính mình

### ✅ HTTPS
- [ ] Buộc HTTPS (http → https)
- [ ] Sử dụng SSL certificate (Let's Encrypt free)
- [ ] Configurable trong Supabase settings

### ✅ CORS
- [ ] Kiểm tra CORS settings trong Supabase
- [ ] Chỉ cho phép domain của bạn

### ✅ Rate Limiting
- [ ] Bật rate limiting trên Supabase
- [ ] Tránh bot/DDoS attacks

---

## 📊 Monitoring & Logs

### Supabase Dashboard
- **Realtime Stats**: Xem request/response
- **Database**: Kiểm tra data
- **Auth**: Xem users đã đăng ký
- **Logs**: Debug issues

### Browser Console
```javascript
// Kiểm tra connection
console.log(window.limoGoSupabase.auth.getSession());

// Kiểm tra realtime
console.log(window.limoGoSupabase.getChannels());

// Query data
const { data } = await window.limoGoSupabase.from("rides").select("*");
console.log(data);
```

---

## 🚨 Troubleshooting

### ❌ "Could not connect to database"
- [ ] Kiểm tra Supabase project đang chạy
- [ ] Kiểm tra Project URL đúng
- [ ] Đợi 5-10 phút sau khi tạo project

### ❌ "Auth not initialized"
- [ ] Kiểm tra Anon Key đúng
- [ ] Reload trang (Ctrl+F5)
- [ ] Xóa cache (Ctrl+Shift+Delete)

### ❌ "RLS violation"
- [ ] Kiểm tra đã đăng nhập
- [ ] Xem RLS policies
- [ ] Chạy lại schema.sql

### ❌ Chuyến không lưu được
- [ ] Mở Console (F12)
- [ ] Kiểm tra lỗi Supabase
- [ ] Kiểm tra RLS trên bảng `rides`

### ❌ Bản đồ không hiển thị
- [ ] Kiểm tra kết nối internet
- [ ] Bật JS trong trình duyệt
- [ ] Reload (F5)

---

## 📈 Phát triển tiếp theo

### Phase 2 (Month 1)
- [ ] Kết nối Google Maps API
- [ ] Thanh toán thực tế (MoMo)
- [ ] GPS realtime tài xế
- [ ] Push notifications

### Phase 3 (Month 2-3)
- [ ] Admin dashboard
- [ ] Backend Edge Functions (Supabase Functions)
- [ ] Chat realtime (Socket.io)
- [ ] Promotion system advanced

### Phase 4 (Month 4+)
- [ ] Native app (React Native/Flutter)
- [ ] Offline-first (Service Worker)
- [ ] Multi-language
- [ ] Dark mode

---

## 💰 Chi phí ước tính

| Dịch vụ | Miễn phí | Paid |
|--------|---------|------|
| Supabase Database | ✓ 500MB | $25+/tháng |
| Supabase Auth | ✓ Unlimited | Included |
| Supabase Realtime | ✓ Yes | Included |
| Hosting (Netlify) | ✓ Free tier | $19+/tháng |
| Google Maps API | ✗ | $7-14/1000 calls |
| MoMo Gateway | N/A | Depends |

**Khởi động:** Hoàn toàn miễn phí!

---

## 📞 Support

1. **Lỗi cấu hình:**
   - Xem `QUICKSTART.html`
   - Xem `SUPABASE_SETUP.md`

2. **Lỗi code:**
   - Mở Developer Console (F12)
   - Xem error message
   - Tìm trong `README.md` → Troubleshooting

3. **Lỗi Supabase:**
   - Xem Supabase Dashboard → Logs
   - Check database status

4. **Kết nối Internet:**
   - Kiểm tra kết nối
   - Thử ping Supabase

---

## ✅ Deployment Checklist

- [ ] Supabase project tạo xong
- [ ] API keys cấu hình trong code
- [ ] Schema SQL chạy xong
- [ ] RLS policies bật
- [ ] Test đăng ký/đăng nhập
- [ ] Test đặt xe → Lưu DB
- [ ] Test xem lịch sử
- [ ] Test ví + điểm
- [ ] Test pages load dữ liệu
- [ ] Realtime subscriptions hoạt động
- [ ] CORS configured
- [ ] HTTPS ready
- [ ] Monitoring setup
- [ ] Backup enabled
- [ ] Domain configured (nếu production)

**Khi tất cả ✓ = Sẵn sàng Launch!**

---

## 🎉 Kết luận

LimoGo đã sẵn sàng cho:
- ✅ Development (Localhost)
- ✅ Staging (Test deployment)
- ✅ Production (Live public)

Hãy bắt đầu với `QUICKSTART.html` hoặc đọc `README.md` để hiểu rõ hơn!

---

**Cập nhật lần cuối:** 2024
**Người duy trì:** LimoGo Team
**License:** MIT

Made with ❤️ for Green Transportation 🌱
