document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.auth-tab');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const submitBtn = document.getElementById('authSubmit');
  const authForm = document.getElementById('authForm');

  function setMode(mode) {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.mode === mode));
    if (formTitle) {
      formTitle.textContent = mode === 'register' ? 'Tạo tài khoản' : 'Chào mừng trở lại';
    }
    if (formSubtitle) {
      formSubtitle.textContent = mode === 'register'
        ? 'Đăng ký để đặt xe nhanh hơn và quản lý chuyến đi từ đầu đến cuối.'
        : 'Đăng nhập để theo dõi chuyến xe và quản lý ví của bạn.';
    }
    if (submitBtn) {
      submitBtn.textContent = mode === 'register' ? 'Đăng ký ngay' : 'Đăng nhập';
    }
    const extraFields = document.querySelectorAll('.register-only');
    extraFields.forEach((field) => {
      field.style.display = mode === 'register' ? 'flex' : 'none';
    });
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));

  if (authForm) {
    authForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const mode = document.querySelector('.auth-tab.active')?.dataset.mode || 'login';
      const status = document.getElementById('authStatus');
      if (status) {
        status.textContent = mode === 'register'
          ? 'Đăng ký thành công. Bạn đã sẵn sàng đặt xe.'
          : 'Đăng nhập thành công. Chào mừng bạn quay lại.';
      }
    });
  }

  setMode('login');
});
