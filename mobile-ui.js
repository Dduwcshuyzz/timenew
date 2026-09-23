(function () {
  function initMobileUI() {
    const body = document.body;
    body.classList.add('app-style');

    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('smart-hero');
    }

    const bookingCard = document.querySelector('.booking-card');
    if (bookingCard) {
      bookingCard.classList.add('phone-card');
    }

    document.querySelectorAll('.quick-card').forEach((card) => {
      card.addEventListener('mouseenter', () => card.classList.add('lift'));
      card.addEventListener('mouseleave', () => card.classList.remove('lift'));
    });

    const chips = document.querySelectorAll('.destination-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((item) => item.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileUI);
  } else {
    initMobileUI();
  }
})();
