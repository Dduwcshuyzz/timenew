document.addEventListener('DOMContentLoaded', () => {
  const pickup = document.getElementById('pickupAddress');
  const locateButton = document.getElementById('locateCustomer');
  const status = document.getElementById('locationStatus');
  if (!pickup || !navigator.geolocation) {
    if (status) status.textContent = 'Thiết bị không hỗ trợ định vị. Bạn có thể nhập điểm đón thủ công.';
    pickup?.removeAttribute('readonly');
    return;
  }

  const setStatus = (message, error = false) => {
    if (status) {
      status.textContent = message;
      status.classList.toggle('location-error', error);
    }
  };

  const locate = () => {
    locateButton?.classList.add('loading');
    setStatus('Đang lấy vị trí GPS của bạn...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const location = { latitude, longitude, accuracy, updatedAt: new Date().toISOString() };
        localStorage.setItem('limogoCustomerLocation', JSON.stringify(location));
        pickup.value = `Vị trí của bạn (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
        setStatus(`Đã định vị khách hàng · độ chính xác khoảng ${Math.round(accuracy)}m`);
        locateButton?.classList.remove('loading');
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Bạn chưa cấp quyền vị trí. Hãy cho phép GPS hoặc nhập điểm đón thủ công.'
          : 'Không lấy được GPS. Vui lòng thử lại hoặc nhập điểm đón thủ công.';
        setStatus(message, true);
        pickup.removeAttribute('readonly');
        pickup.value = 'Nhập điểm đón của bạn';
        locateButton?.classList.remove('loading');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  locateButton?.addEventListener('click', locate);
  locate();
});
