document.addEventListener('DOMContentLoaded', () => {
  const rawBooking = localStorage.getItem('limogoBooking');
  const booking = rawBooking ? JSON.parse(rawBooking) : null;
  const route = document.getElementById('trackingRoute');
  const from = document.getElementById('summaryFrom');
  const to = document.getElementById('summaryTo');
  const payment = document.getElementById('summaryPayment');
  const progress = document.getElementById('trackingProgress');
  const title = document.getElementById('trackingTitle');
  const eta = document.getElementById('trackingEta');
  const cancelButton = document.getElementById('cancelTrip');
  const carPin = document.getElementById('carPin');
  const lastUpdated = document.getElementById('lastUpdated');
  const successCard = document.getElementById('successCard');
  const finishTrip = document.getElementById('finishTrip');
  const summaryVehicle = document.getElementById('summaryVehicle');
  const rideId = document.getElementById('rideId');
  const arrivalTime = document.getElementById('arrivalTime');
  const customerLocationLabel = document.getElementById('customerLocationLabel');
  let realtimeChannel = null;

  if (booking) {
    route.textContent = `${booking.from} → ${booking.to}`;
    from.textContent = booking.from;
    to.textContent = booking.to;
    payment.textContent = booking.payment;
    summaryVehicle.textContent = booking.vehicle;
    rideId.textContent = `LMG-${String(Date.now()).slice(-6)}`;
    if (booking.customerLocation) {
      customerLocationLabel.textContent = `● Khách hàng · ±${Math.round(booking.customerLocation.accuracy || 0)}m`;
    }
  }
  arrivalTime.textContent = new Date(Date.now() + 3 * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  let stage = 0;
  const stages = [
    ['Đang tìm tài xế', 'Đang kết nối với tài xế gần bạn', '—', 18],
    ['Tài xế đang đến', 'Tài xế đang di chuyển đến điểm đón', '3 phút', 54],
    ['Tài xế đã đến', 'Tài xế đang chờ bạn tại điểm đón', 'Đã đến', 100]
  ];
  const updateStage = () => {
    const current = stages[stage];
    title.textContent = current[0];
    route.textContent = booking ? `${booking.from} → ${booking.to}` : current[1];
    eta.textContent = current[2];
    progress.style.width = `${current[3]}%`;
    if (stage === 2) successCard.hidden = false;
  };
  updateStage();
  const stageTimer = window.setInterval(() => {
    if (stage < stages.length - 1) {
      stage += 1;
      updateStage();
    } else {
      window.clearInterval(stageTimer);
    }
  }, 5000);

  let carPosition = 50;
  const moveCar = () => {
    if (stage < 2) {
      carPosition = Math.min(82, carPosition + 2);
      carPin.style.left = `${carPosition}%`;
      lastUpdated.textContent = `Vừa cập nhật lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  };
  const movementTimer = window.setInterval(moveCar, 2200);

  if (window.limoGoSupabase?.channel && booking?.rideId) {
    realtimeChannel = window.limoGoSupabase
      .channel(`ride:${booking.rideId}`)
      .on('broadcast', { event: 'location' }, ({ payload }) => {
        if (typeof payload?.progress === 'number') progress.style.width = `${payload.progress}%`;
        if (typeof payload?.left === 'number') carPin.style.left = `${payload.left}%`;
        lastUpdated.textContent = 'Vừa nhận cập nhật trực tiếp';
      })
      .subscribe();
  }

  cancelButton?.addEventListener('click', () => {
    window.clearInterval(stageTimer);
    window.clearInterval(movementTimer);
    realtimeChannel?.unsubscribe?.();
    localStorage.removeItem('limogoBooking');
    cancelButton.textContent = 'Đã hủy chuyến';
    cancelButton.disabled = true;
    title.textContent = 'Chuyến đã được hủy';
    eta.textContent = 'Hoàn tất';
    progress.style.width = '0%';
    successCard.hidden = true;
  });

  finishTrip?.addEventListener('click', () => {
    window.clearInterval(movementTimer);
    successCard.querySelector('h2').textContent = 'Chúc bạn thượng lộ bình an!';
    successCard.querySelector('p').textContent = 'Chuyến đi đã bắt đầu. Bạn có thể chia sẻ hành trình với người thân bất cứ lúc nào.';
    finishTrip.textContent = 'Đã lên xe';
    finishTrip.disabled = true;
  });
});
