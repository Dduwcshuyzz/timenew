# 🔧 Hướng dẫn cấu hình Supabase cho LimoGo

## Bước 1: Tạo dự án Supabase

### 1.1 Đăng ký Supabase
1. Truy cập https://supabase.com
2. Click **"Sign Up"**
3. Chọn cách đăng ký (GitHub, Google, hoặc Email)
4. Xác thực email nếu cần

### 1.2 Tạo dự án mới
1. Sau khi đăng nhập, click **"New project"**
2. Điền thông tin:
   - **Project name**: `limogo` (hoặc tên khác)
   - **Database password**: Nhớ mật khẩu này
   - **Region**: Chọn gần nhất (VN: Singapore)
3. Click **"Create new project"** và đợi 5-10 phút

### 1.3 Lấy API Keys
1. Vào **Project Settings** (bánh răng ⚙️ góc dưới trái)
2. Click tab **"API"**
3. Sao chép:
   - **Project URL** (ví dụ: `https://abcxyz.supabase.co`)
   - **Anon Public Key** (bắt đầu bằng `ey...`)
4. **CẢNH BÁO**: Không bao giờ chia sẻ Service Role Key!

## Bước 2: Chạy Schema SQL

### 2.1 Mở SQL Editor
1. Trong Supabase Dashboard, click **"SQL Editor"** (bên trái)
2. Click **"New Query"**

### 2.2 Copy và chạy SQL
1. Mở file `supabase/schema.sql` từ thư mục dự án
2. Copy toàn bộ nội dung (Ctrl+A → Ctrl+C)
3. Paste vào SQL Editor trong Supabase (Ctrl+V)
4. Click nút **"Run"** (hoặc Ctrl+Enter)

⏳ **Chờ đến khi thấy "Command completed successfully"**

### 2.3 Xác thực tables được tạo
1. Click **"Table Editor"** (bên trái)
2. Kiểm tra các bảng xuất hiện:
   - `profiles`
   - `drivers`
   - `rides`
   - `payments`
   - `promo_codes`

## Bước 3: Cấu hình API Keys trong code

### 3.1 Mở file `js/supabase-config.js`
```javascript
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

### 3.2 Thay thế bằng API Keys của bạn
```javascript
export const SUPABASE_URL = "https://apbkhhmdofljvitwkvcf.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...";
```

💾 **Lưu file** (Ctrl+S)

## Bước 4: Kiểm tra kết nối

### 4.1 Chạy local server
```bash
cd /đường/dẫn/tới/timenew
python -m http.server 8000
```

### 4.2 Mở trình duyệt
1. Truy cập http://localhost:8000
2. Mở **Developer Console** (F12 → Console tab)
3. Gõ lệnh để kiểm tra:
   ```javascript
   window.limoGoSupabase.auth.getSession()
   ```

✅ Nếu không có lỗi = Kết nối OK

## Bước 5: Kiểm tra Auth (đăng ký/đăng nhập)

### 5.1 Đăng ký tài khoản test
1. Trên trang LimoGo, click **"Đăng nhập"** (góc phải header)
2. Click tab **"Đăng ký"**
3. Nhập:
   - Họ tên: `Nguyễn Văn A`
   - Email: `test@example.com`
   - Mật khẩu: `123456` (tối thiểu 6 ký tự)
   - Nhập lại: `123456`
4. Click **"Đăng ký"**

✅ Nếu thấy "✓ Đăng ký thành công!" = Auth OK

### 5.2 Xác thực trong Supabase
1. Vào Supabase Dashboard
2. Click **"Authentication"** (bên trái)
3. Click tab **"Users"**
4. Bạn sẽ thấy user `test@example.com` vừa tạo

## Bước 6: Kiểm tra Database

### 6.1 Kiểm tra profiles tự động
1. Click **"Table Editor"** → **"profiles"**
2. Bạn sẽ thấy 1 row với:
   - `id`: UUID của user
   - `full_name`: "Nguyễn Văn A"
   - `wallet_balance`: 0
   - `reward_points`: 0

✅ Nếu có row = Trigger OK (auto-create profile)

### 6.2 Kiểm tra drivers mẫu
1. Click **"Table Editor"** → **"drivers"**
2. Bạn sẽ thấy 1 tài xế mẫu:
   - Name: "Nguyễn Văn Nam"
   - License: "51H-123.45"

## Bước 7: Kiểm tra RLS Policies

### 7.1 Xem RLS Policies
1. Click **"Table Editor"** → chọn table `profiles`
2. Click tab **"RLS"**
3. Bạn sẽ thấy 2 policies:
   - `SELECT`: User chỉ xem profile của mình
   - `UPDATE`: User chỉ sửa profile của mình

✅ Nếu có policies = Bảo mật OK

### 7.2 Test RLS Policy
1. Mở 2 tab trình duyệt:
   - **Tab 1**: Đăng nhập với `test@example.com`
   - **Tab 2**: Đăng nhập với user khác
2. Trong Console của Tab 1, gõ:
   ```javascript
   const { data } = await window.limoGoSupabase.from("profiles").select("*");
   console.log(data); // Chỉ thấy profile của test@example.com
   ```
3. Trong Console của Tab 2, gõ câu lệnh tương tự
   ```javascript
   const { data } = await window.limoGoSupabase.from("profiles").select("*");
   console.log(data); // Chỉ thấy profile của user khác
   ```

✅ Nếu mỗi user chỉ thấy dữ liệu của mình = RLS OK

## Bước 8: Kiểm tra Realtime Subscriptions

### 8.1 Kiểm tra channel
1. Mở Console (F12)
2. Gõ:
   ```javascript
   window.limoGoSupabase.getChannels()
   ```

✅ Nếu có channels = Realtime OK

## Bước 9: Thêm dữ liệu mẫu (Tuỳ chọn)

### 9.1 Thêm tài xế mẫu khác
1. Click **"Table Editor"** → **"drivers"**
2. Click **"Insert row"**
3. Nhập:
   - `driver_name`: "Trần Thị Linh"
   - `phone`: "0987654321"
   - `vehicle_license_plate`: "51H-987.65"
   - `vehicle_type`: "Xe máy điện"
   - `status`: "available"
   - `rating`: 4.8

### 9.2 Thêm mã khuyến mãi
1. Click **"Table Editor"** → **"promo_codes"**
2. Click **"Insert row"**
3. Nhập:
   - `code`: "XANH50"
   - `discount_percent`: 50
   - `max_discount`: 50000
   - `is_active`: true

## Troubleshooting

### ❌ Lỗi: "Could not connect to database"
**Giải pháp:**
- Kiểm tra Supabase project đang chạy
- Đợi 5-10 phút sau khi tạo project

### ❌ Lỗi: "Auth not initialized"
**Giải pháp:**
- Kiểm tra API key trong `supabase-config.js`
- Reload trang (Ctrl+F5)
- Xóa cache: Ctrl+Shift+Delete

### ❌ Lỗi: "RLS violation"
**Giải pháp:**
- Kiểm tra đã đăng nhập
- Kiểm tra RLS policies trong Supabase
- Xóa policies sai, chạy lại `schema.sql`

### ❌ Chuyến không lưu được
**Giải pháp:**
- Đảm bảo đã đăng nhập
- Kiểm tra bảng `rides` có RLS policy
- Xem console error (F12)

### ❌ Realtime không update
**Giải pháp:**
- Kiểm tra Realtime đã được kích hoạt
- Xem mục "Realtime" trong Supabase Settings
- Bật nếu tắt

## Ví dụ Live Testing

### Scenario 1: Đặt xe hoàn chỉnh
```
1. Trang chủ → Đặt xe
2. Nhập: Từ "Vị trí hiện tại" → "Landmark 81"
3. Chọn: Xe điện tiêu chuẩn
4. Áp dụng: Mã "XANH30"
5. Chọn: Thanh toán "Tiền mặt"
6. Click: "Xác nhận đặt xe"
7. Kết quả: 
   ✓ Thấy "Hóa đơn chuyến đi"
   ✓ Bảng rides có 1 chuyến mới
   ✓ Profile có +1 điểm thưởng
```

### Scenario 2: Xem lịch sử
```
1. Bottom nav → "Lịch sử"
2. Kết quả:
   ✓ Thấy chuyến vừa đặt
   ✓ Hiển thị đúng giá tiền
   ✓ Trạng thái = "Đang tìm tài xế"
```

### Scenario 3: Kiểm tra ví
```
1. Bottom nav → "Tài khoản"
2. Click: "Ví"
3. Kết quả:
   ✓ Số dư ban đầu: 0đ
   ✓ Điểm thưởng tăng lên
   ✓ Giao dịch mới xuất hiện
```

## ✅ Checklist hoàn tất

- [ ] Supabase project tạo thành công
- [ ] API Keys lấy được
- [ ] Schema SQL chạy xong
- [ ] Tất cả 5 bảng có dữ liệu
- [ ] Auth (đăng ký/đăng nhập) hoạt động
- [ ] Profile tự động tạo
- [ ] RLS Policies bảo vệ dữ liệu
- [ ] Đặt xe → Lưu vào database
- [ ] Xem lịch sử chuyến
- [ ] Xem thông tin ví

🎉 **Nếu tất cả OK = LimoGo đã sẵn sàng sử dụng!**

---

## 📞 Ghi chú quan trọng

1. **API Key an toàn**: Chỉ dùng "Anon Public Key" trên frontend
2. **Service Role Key**: Chỉ dùng trên backend, không bao giờ gửi client
3. **RLS Policies**: Luôn bật RLS để bảo vệ dữ liệu người dùng
4. **Realtime**: Có thể tắt nếu không cần update realtime (tiết kiệm bandwidth)
5. **Backup**: Supabase tự động backup hàng ngày

---

**Last Updated**: 2024
