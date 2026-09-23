# 💡 LimoGo - Mẹo Phát triển & Best Practices

## 🎯 Nguyên tắc phát triển

### 1. Mobile-First
- Luôn thiết kế cho mobile trước
- Test trên iPhone/Android
- Dùng Chrome DevTools → Device Toolbar (Ctrl+Shift+M)

### 2. Realtime Updates
- Dùng Supabase subscriptions khi có thay đổi
- Không polling nếu không cần
- Unsubscribe khi component unmount

### 3. Performance
- Lazy load images
- Minimize CSS/JS
- Cache API calls
- Compression (gzip)

### 4. Security
- Validate input trước khi submit
- Escape HTML để tránh XSS
- Dùng HTTPS
- Bật RLS trên database

---

## 🛠️ Development Tools

### Recommended Extensions (VS Code)
```
- Prettier (Format code)
- SQLTools (Database management)
- Thunder Client (API testing)
- Live Server (Run local server)
- Better Comments
```

### Debug Console Commands
```javascript
// Kiểm tra session
await window.limoGoSupabase.auth.getSession()

// Lấy user hiện tại
const { data: { user } } = await window.limoGoSupabase.auth.getUser()

// Query data
const { data } = await window.limoGoSupabase.from("rides").select("*")

// Watch realtime
window.limoGoSupabase.channel("rides:new").on("*", console.log).subscribe()

// Logout
await window.limoGoSupabase.auth.signOut()
```

---

## 📝 Code Style Guide

### HTML
```html
<!-- ✅ Tốt -->
<button class="btn btn-primary" id="confirmRide">
  Xác nhận đặt xe
</button>

<!-- ❌ Tránh -->
<button onclick="confirmRide()" style="color: green;">Confirm</button>
```

### CSS
```css
/* ✅ Tốt */
.booking-card {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #fff;
  border-radius: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ❌ Tránh */
.bookingCard {
  display:flex;gap:15px;padding:20px;background:#fff}
```

### JavaScript
```javascript
// ✅ Tốt
async function loadUserRides(userId) {
  if (!userId) return null;
  
  try {
    const { data, error } = await window.limoGoSupabase
      .from("rides")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Lỗi tải chuyến:", error.message);
    return null;
  }
}

// ❌ Tránh
function load(u){
  return window.limoGoSupabase.from("rides").select("*").eq("user_id",u)
}
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] `loadProfile()` trả về đúng dữ liệu
- [ ] `calculateFare()` tính giá đúng
- [ ] `applyPromoCode()` áp dụng discount
- [ ] `formatPaymentItem()` hiển thị đúng

### Integration Tests
- [ ] Đăng ký → Tạo profile tự động
- [ ] Đặt xe → Lưu vào database
- [ ] Thanh toán → Cộng điểm
- [ ] Realtime → Update trạng thái

### E2E Tests
- [ ] Toàn bộ flow đặt xe
- [ ] Từ signup đến completion
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Mobile + Desktop

### Manual Tests
- [ ] Network offline → App graceful fail
- [ ] Long loading → Show spinner
- [ ] Empty state → Show message
- [ ] Error → Show helpful error

---

## 🐛 Debugging Tips

### 1. Network Issues
```javascript
// Kiểm tra kết nối
const { data, error } = await window.limoGoSupabase.auth.getSession()
if (error) console.error("Kết nối thất bại:", error)
```

### 2. Auth Issues
```javascript
// Xem user
const { data: { user } } = await window.limoGoSupabase.auth.getUser()
console.log(user)

// Xem session
const { data: { session } } = await window.limoGoSupabase.auth.getSession()
console.log(session)
```

### 3. Database Issues
```javascript
// Query test
const { data, error } = await window.limoGoSupabase
  .from("rides")
  .select("*")
  .limit(1)

if (error) console.error("DB Error:", error.message)
console.log("Data:", data)
```

### 4. Realtime Issues
```javascript
// Xem channels đang active
console.log(window.limoGoSupabase.getChannels())

// Subscribe test
window.limoGoSupabase
  .channel("test")
  .on("*", (payload) => console.log("Update:", payload))
  .subscribe()
```

### 5. Performance Issues
```javascript
// Measure load time
console.time("LoadRides")
await loadUserRides(userId)
console.timeEnd("LoadRides")
```

---

## 🔄 Git Workflow

### Commit Messages
```
✨ feat: Add ride rating system
🐛 fix: Fix map not displaying
📝 docs: Update README
🎨 style: Format code
♻️ refactor: Simplify payment logic
⚡ perf: Optimize database queries
🧪 test: Add unit tests
```

### Branch Strategy
```
main ──┬── development
       │
       ├── feature/google-maps
       ├── feature/momo-payment
       ├── bugfix/map-overlap
       └── hotfix/auth-error
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile: 320px - 639px */
@media (max-width: 639px) {
  .container { padding: 10px; }
}

/* Tablet: 640px - 1023px */
@media (min-width: 640px) and (max-width: 1023px) {
  .container { padding: 20px; }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container { padding: 40px; }
}
```

### Mobile-First Approach
```css
/* ✅ Tốt: Mobile first */
.card { padding: 15px; }

@media (min-width: 640px) {
  .card { padding: 20px; }
}

@media (min-width: 1024px) {
  .card { padding: 30px; }
}
```

---

## 🚀 Performance Optimization

### Images
```html
<!-- ✅ Tốt: Responsive images -->
<img 
  src="image.jpg" 
  srcset="image-small.jpg 320w, image-medium.jpg 640w, image-large.jpg 1024w"
  alt="Description"
/>

<!-- ✅ Tốt: Lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description" />
```

### CSS
```css
/* ✅ Tốt: Minimize repaints */
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```

### JavaScript
```javascript
// ✅ Tốt: Debounce user input
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((term) => {
  searchRides(term);
}, 500);
```

---

## 🧩 Refactoring Guide

### Khi nào refactor?
- ✅ Code duplicate
- ✅ Function quá dài (>50 lines)
- ✅ Quá nhiều parameters (>3)
- ✅ Complexity cao
- ✅ Performance issue

### Ví dụ Refactoring

**Before:**
```javascript
async function bookRide() {
  const user = await getUser();
  const rides = await getRides();
  const payments = await getPayments();
  const total = calculateTotal(rides, payments);
  // ... 100 lines of code ...
}
```

**After:**
```javascript
async function bookRide() {
  const user = await getUser();
  const bookingData = await loadBookingData(user.id);
  const total = calculateBookingTotal(bookingData);
  // ... 20 lines of code ...
}

async function loadBookingData(userId) {
  const [rides, payments] = await Promise.all([
    getRides(userId),
    getPayments(userId)
  ]);
  return { rides, payments };
}
```

---

## 📊 Monitoring

### Supabase Monitoring
- **Database**: Xem queries/performance
- **Auth**: Xem login success rate
- **Realtime**: Xem subscriptions
- **Storage**: Xem disk usage

### Application Monitoring
```javascript
// Log errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // Send to logging service
});

// Log unhandled rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled rejection:", event.reason);
  // Send to logging service
});
```

---

## 🔒 Security Checklist

- [ ] Input validation trước submit
- [ ] SQL injection prevention (Supabase parameterized queries)
- [ ] XSS prevention (escapeHtml function)
- [ ] CSRF tokens nếu form POST
- [ ] Password min 6 characters
- [ ] Email verification
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] Secure cookies (httpOnly, secure flags)
- [ ] RLS Policies enabled

---

## 📚 Learning Resources

### Supabase
- Docs: https://supabase.com/docs
- Realtime: https://supabase.com/docs/guides/realtime
- Auth: https://supabase.com/docs/guides/auth

### JavaScript
- MDN Web Docs: https://developer.mozilla.org
- async/await: https://javascript.info/async-await
- Promises: https://javascript.info/promise

### CSS
- MDN CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- Flexbox: https://flexboxfroggy.com/
- Grid: https://cssgridgarden.com/

### Tools
- Can I Use: https://caniuse.com/
- CSS Validator: https://jigsaw.w3.org/css-validator/
- JS Linter: https://www.jslint.com/

---

## 🎓 Best Practices Summary

| Aspect | Best Practice |
|--------|----------------|
| Code | DRY, KISS, SOLID principles |
| Performance | Optimize critical path, lazy load |
| Security | Validate input, escape output, HTTPS |
| Testing | Unit + Integration + E2E |
| Documentation | Clear comments, README, Changelog |
| Git | Meaningful commits, PR reviews |
| Mobile | Mobile-first, touch-friendly |
| Accessibility | ARIA labels, semantic HTML |
| Maintainability | Modular code, consistent style |
| DevOps | Version control, CI/CD, monitoring |

---

**Ghi nhớ:** Luôn viết code cho người khác sẽ đọc, không phải cho máy tính!

Made with ❤️ for Better Code Quality 💪
