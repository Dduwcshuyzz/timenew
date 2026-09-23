# 🤝 Hướng dẫn đóng góp - LimoGo

Cảm ơn bạn quan tâm đến việc đóng góp cho LimoGo! Tài liệu này sẽ hướng dẫn bạn quy trình đóng góp.

## 📋 Code of Conduct

Chúng tôi cam kết duy trì một cộng đồng thân thiện và bao dung. Vui lòng tôn trọng tất cả những người tham gia.

---

## 🚀 Bắt đầu

### 1. Fork repository
```bash
# Trên GitHub, click "Fork" để copy repo vào tài khoản của bạn
```

### 2. Clone repository
```bash
git clone https://github.com/your-username/limogo.git
cd limogo
```

### 3. Tạo branch mới
```bash
# Branch feature
git checkout -b feature/your-feature-name

# Branch bugfix
git checkout -b bugfix/issue-description

# Branch hotfix
git checkout -b hotfix/critical-issue
```

### 4. Install dependencies (nếu cần)
```bash
npm install
```

---

## 💻 Quy trình phát triển

### Setup local environment
```bash
# Copy example config
cp js/supabase-config.example.js js/supabase-config.js

# Edit với API keys của bạn
nano js/supabase-config.js

# Chạy local server
npm start
```

### Code style
- Dùng **Prettier** để format: `npm run format`
- Dùng **ESLint** để lint: `npm run lint`
- Viết comments cho code phức tạp
- Tên variable/function bằng tiếng Anh

### Ví dụ good code:
```javascript
/**
 * Calculate ride fare based on distance and vehicle type
 * @param {number} distance - Distance in km
 * @param {string} vehicleType - Type of vehicle
 * @returns {number} Calculated fare in VND
 */
function calculateFare(distance, vehicleType) {
  const baseFares = {
    standard: 12000,
    premium: 18000,
    van: 24000
  };
  
  const perKmRate = vehicleType === 'standard' ? 13500 : 15500;
  return baseFares[vehicleType] + Math.max(1, distance) * perKmRate;
}
```

---

## 🧪 Testing

### Manual testing
- Test trên desktop + mobile
- Test trên Chrome, Firefox, Safari, Edge
- Test offline/online transitions
- Test error states

### Browser DevTools
```javascript
// Console commands để test
window.limoGoSupabase.auth.getSession()
const { data } = await window.limoGoSupabase.from("rides").select("*")
```

### Checklist trước push
- [ ] Code chạy không lỗi
- [ ] No console errors
- [ ] Responsive trên mobile
- [ ] Features hoạt động đúng
- [ ] Database queries chuẩn
- [ ] RLS policies kiểm tra

---

## 📝 Commit messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: Tính năng mới
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting/CSS
- `refactor`: Code restructure
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Build/dependencies

### Examples
```
✨ feat(booking): Add promo code validation
🐛 fix(map): Fix marker overlap on tracking
📝 docs(setup): Add Supabase configuration guide
🎨 style(payment): Improve button styling
♻️ refactor(realtime): Simplify subscription logic
⚡ perf(database): Optimize ride queries
```

---

## 📤 Pull Request Process

### 1. Push branch
```bash
git add .
git commit -m "feat(feature): Description"
git push origin feature/your-feature-name
```

### 2. Create PR
- Title: Descriptive title
- Description: What changed and why
- Reference: Link related issues (#123)
- Checklist: Mark completed items

### 3. PR Description Template
```markdown
## 📝 Description
Brief description of changes

## 🔗 Related Issue
Fixes #(issue number)

## 🧪 Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested on Firefox
- [ ] No console errors

## 📸 Screenshots (if applicable)
Before/After images

## 📋 Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Comments added
- [ ] No new warnings
- [ ] Tests pass
- [ ] Docs updated
```

### 4. Code Review
- Respond to reviewer comments
- Update code if needed
- Re-request review after changes

---

## 🐛 Báo cáo lỗi

### Issue template
```
**Describe the bug:**
Clear description of what went wrong

**Steps to reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected behavior:**
What should happen

**Actual behavior:**
What actually happens

**Screenshots:**
Add images if helpful

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Mobile: iPhone 15 Pro

**Additional context:**
Any other info
```

---

## 💡 Yêu cầu tính năng

### Feature request template
```
**Is your feature request related to a problem?**
Problem description

**Describe the solution you'd like:**
Solution description

**Describe alternatives you've considered:**
Alternative approaches

**Additional context:**
Any other info
```

---

## 📚 Documentation

### Khi thêm tính năng mới
- Update `README.md`
- Add comments trong code
- Update `CHANGELOG.md`
- Add to `DEVELOPMENT.md` nếu liên quan

### Khi thay đổi database
- Update `supabase/schema.sql`
- Document changes trong comments
- Update `SUPABASE_SETUP.md`

### Khi thay đổi API
- Update `README.md` → API section
- Add JSDoc comments
- Document parameters & returns

---

## 🔒 Security Guidelines

### NEVER commit:
- Supabase keys/secrets
- API credentials
- Private configuration
- Sensitive data

### Use environment variables:
```javascript
// .env (don't commit)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=ey...

// Code
const url = process.env.SUPABASE_URL;
```

### Security checklist:
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CORS properly configured
- [ ] RLS policies enabled

---

## 📊 Development workflow

### Day-to-day
```bash
# Update branch
git fetch origin
git rebase origin/main

# Make changes
# ... edit files ...

# Test
npm start  # Local server
npm test   # Run tests

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/branch-name

# Create PR on GitHub
```

### Resolve conflicts
```bash
# Get latest main
git fetch origin
git rebase origin/main

# Fix conflicts in editor
# Then
git add .
git rebase --continue
git push origin feature/branch-name -f
```

---

## 🏆 Best practices

### Code Quality
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ SOLID principles
- ✅ Readable variable names
- ✅ Functions có 1 responsibility

### Performance
- ✅ Minimize DOM manipulation
- ✅ Debounce user input
- ✅ Lazy load images
- ✅ Cache API responses
- ✅ Optimize database queries

### Testing
- ✅ Test happy path
- ✅ Test edge cases
- ✅ Test error handling
- ✅ Test mobile
- ✅ Test cross-browser

---

## 📞 Questions?

- 📖 Read: `DEVELOPMENT.md`
- 🔍 Search: Issues/PRs history
- 💬 Ask: Create discussion
- 📧 Email: support@limogo.local

---

## 🎉 Thank you!

Cảm ơn bạn đã đóng góp cho LimoGo. Cộng đồng của chúng tôi được mạnh mẽ nhờ những người như bạn! 💚

---

**Happy coding!** 🚀

Made with ❤️ by LimoGo Team
