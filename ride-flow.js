document.addEventListener('DOMContentLoaded', () => {
  const pickup = document.getElementById('pickupAddress');
  const destination = document.getElementById('destinationAddress');
  const vehicles = document.querySelectorAll('.vehicle-option');
  const paymentMethods = document.querySelectorAll('.payment-box');
  const searchButton = document.getElementById('confirmBooking');

  if (vehicles.length) {
    vehicles.forEach((vehicle) => {
      vehicle.addEventListener('click', () => {
        vehicles.forEach((item) => item.classList.remove('active'));
        vehicle.classList.add('active');
      });
    });
  }

  if (paymentMethods.length) {
    paymentMethods.forEach((method) => {
      method.addEventListener('click', () => {
        paymentMethods.forEach((item) => item.classList.remove('active'));
        method.classList.add('active');
      });
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const from = pickup?.value || 'Vị trí của bạn';
      const to = destination?.value || 'Điểm đến';
      if (!to.trim() || to === 'Điểm đến') {
        destination?.focus();
        return;
      }
      const selectedVehicle = document.querySelector('.vehicle-option.active strong')?.textContent || 'Xe điện tiêu chuẩn';
      const selectedPayment = document.querySelector('.payment-box.active')?.textContent?.trim() || 'Tiền mặt';
      const customerLocation = localStorage.getItem('limogoCustomerLocation');
      localStorage.setItem('limogoBooking', JSON.stringify({
        rideId: `LMG-${Date.now().toString().slice(-8)}`,
        from,
        to,
        vehicle: selectedVehicle,
        payment: selectedPayment,
        customerLocation: customerLocation ? JSON.parse(customerLocation) : null,
        createdAt: new Date().toISOString()
      }));
      const status = document.getElementById('bookingStatus');
      if (status) {
        status.textContent = `${from} → ${to} · Đang tìm tài xế gần bạn...`;
      }
      window.setTimeout(() => {
        window.location.href = 'tracking.html';
      }, 450);
    });
  }
});
