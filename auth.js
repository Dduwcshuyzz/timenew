(function () {
  function bindAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        authTabs.forEach((item) => item.classList.toggle('active', item === tab));
        const mode = tab.dataset.auth;
        const form = document.getElementById('authForm');
        const submit = document.getElementById('authSubmit');
        const title = document.getElementById('authTitle');
        const subtitle = document.getElementById('authSubtitle');
        if (!form || !submit || !title || !subtitle) return;

        const isRegister = mode === 'register';
        document.querySelectorAll('.register-only').forEach((field) => {
          field.classList.toggle('visible', isRegister);
        });
        title.textContent = isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập tài khoản';
        subtitle.textContent = isRegister
          ? 'Đăng ký để lưu địa điểm, nhận ưu đãi và đặt xe nhanh hơn.'
          : 'Đăng nhập để quản lý chuyến đi và ví của bạn.';
        submit.innerHTML = isRegister ? 'Đăng ký <span>→</span>' : 'Đăng nhập <span>→</span>';
      });
    });
  }

  function bindQuickAuth() {
    const accountButton = document.getElementById('accountButton');
    const authModal = document.getElementById('authModal');
    if (accountButton && authModal) {
      accountButton.addEventListener('click', () => {
        authModal.classList.add('show');
        authModal.setAttribute('aria-hidden', 'false');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindAuthTabs();
      bindQuickAuth();
    });
  } else {
    bindAuthTabs();
    bindQuickAuth();
  }
})();
