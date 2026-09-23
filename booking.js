(function () {
  function initBookingFlow() {
    const searchButton = document.getElementById('searchRide');
    if (!searchButton) return;

    searchButton.addEventListener('click', () => {
      const destination = document.getElementById('destination');
      const pickup = document.getElementById('pickup');
      if (!destination || !pickup) return;

      const pickupText = pickup.value || 'Vị trí hiện tại';
      const destinationText = destination.value || 'Bến xe';
      document.getElementById('summaryPickup').textContent = pickupText;
      document.getElementById('summaryDestination').textContent = destinationText;
      document.getElementById('rideModal').classList.add('show');
      document.getElementById('rideModal').setAttribute('aria-hidden', 'false');
    });

    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    vehicleOptions.forEach((option) => {
      option.addEventListener('click', () => {
        vehicleOptions.forEach((item) => item.classList.remove('chosen'));
        option.classList.add('chosen');
      });
    });

    const confirmRide = document.getElementById('confirmRide');
    if (confirmRide) {
      confirmRide.addEventListener('click', () => {
        const receiptModal = document.getElementById('receiptModal');
        if (receiptModal) {
          receiptModal.classList.add('show');
          receiptModal.setAttribute('aria-hidden', 'false');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingFlow);
  } else {
    initBookingFlow();
  }
})();
