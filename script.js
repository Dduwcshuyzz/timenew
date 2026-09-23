const modal = document.getElementById("rideModal");
const toast = document.getElementById("toast");
const destination = document.getElementById("destination");
const pickup = document.getElementById("pickup");
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
let authMode = "login";
const schedulePanel = document.getElementById("schedulePanel");
let routeDistance = 0;
let routeLayer;
let destinationMarker;
let activeDiscount = 0;
let selectedPayment = "cash";
let trackingMap;
let driverMarker;
let trackingTimer;
let trackingRoute;
let trackingPickupMarker;
const knownPlaces = {
  "sân bay tân sơn nhất": [10.8188, 106.6519],
  "landmark 81": [10.7952, 106.7218],
  "phố đi bộ nguyễn huệ": [10.7741, 106.7037],
  "hồ con rùa": [10.7855, 106.6936]
};

document.querySelectorAll(".destination-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    destination.value = chip.dataset.place;
    findDestination(chip.dataset.place);
    document.getElementById("mapStatus").textContent = `Đã chọn tuyến ${chip.dataset.place}`;
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    item.classList.toggle("open");
  });
});

const liveMap = window.L ? L.map("liveMap", { zoomControl: false }).setView([10.7769, 106.7009], 12) : null;
if (liveMap) {
  L.control.zoom({ position: "bottomright" }).addTo(liveMap);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(liveMap);
  L.marker([10.7769, 106.7009]).addTo(liveMap).bindPopup("Vị trí đón mặc định").openPopup();
}

function haversine(a, b) {
  const earthRadius = 6371;
  const lat = (b[0] - a[0]) * Math.PI / 180;
  const lon = (b[1] - a[1]) * Math.PI / 180;
  const value = Math.sin(lat / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(lon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function updateFare(distance) {
  routeDistance = distance;
  const km = Math.max(1, distance);
  const selected = document.querySelector(".vehicle-option.chosen");
  const fare = Math.round((Number(selected.dataset.base) + km * Number(selected.dataset.km)) / 1000) * 1000;
  document.getElementById("mapFare").innerHTML = `<span>Khoảng cách</span><strong>${distance.toFixed(1)} km</strong><span>Giá dự kiến</span><strong>${fare.toLocaleString("vi-VN")} đ</strong>`;
  document.getElementById("summaryDistance").textContent = `${distance.toFixed(1)} km`;
  document.querySelectorAll(".vehicle-option").forEach((item) => {
    const price = Math.round((Number(item.dataset.base) + km * Number(item.dataset.km)) / 1000) * 1000;
    item.querySelector("b").textContent = `${price.toLocaleString("vi-VN")}đ`;
  });
  if (document.getElementById("fareSubtotal")) updatePaymentTotal();
}

function drawRoute(destinationPoint, label) {
  if (!liveMap) return;
  if (routeLayer) liveMap.removeLayer(routeLayer);
  if (destinationMarker) liveMap.removeLayer(destinationMarker);
  const pickupPoint = [10.7769, 106.7009];
  routeLayer = L.polyline([pickupPoint, destinationPoint], { color: "#15926a", weight: 5, dashArray: "8 8" }).addTo(liveMap);
  destinationMarker = L.marker(destinationPoint).addTo(liveMap).bindPopup(label).openPopup();
  liveMap.fitBounds(routeLayer.getBounds(), { padding: [28, 28] });
  updateFare(haversine(pickupPoint, destinationPoint) * 1.18);
}

function findDestination(name) {
  const known = knownPlaces[name.trim().toLowerCase()];
  if (known) {
    drawRoute(known, name);
    document.getElementById("mapStatus").textContent = `Đã tìm thấy ${name}`;
    return;
  }
  document.getElementById("mapStatus").textContent = "Đang tìm địa điểm trên bản đồ...";
  fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=vn&q=${encodeURIComponent(name)}`, { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error("Không thể tìm địa điểm");
      return response.json();
    })
    .then((places) => {
      if (!places.length) throw new Error("Không tìm thấy địa điểm");
      drawRoute([Number(places[0].lat), Number(places[0].lon)], places[0].display_name.split(",")[0]);
      document.getElementById("mapStatus").textContent = "Đã cập nhật tuyến đường";
    })
    .catch(() => {
      document.getElementById("mapStatus").textContent = "Chưa tìm thấy địa điểm. Hãy thử tên cụ thể hơn.";
      showToast("Không thể định vị điểm đến này.");
    });
}

document.querySelectorAll(".ride-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".ride-tab").forEach((item) => item.classList.remove("selected"));
    tab.classList.add("selected");
    schedulePanel.classList.toggle("show", tab.dataset.type === "schedule");
  });
});

document.getElementById("searchRide").addEventListener("click", () => {
  if (!destination.value.trim()) {
    destination.focus();
    destination.placeholder = "Vui lòng nhập điểm đến";
    return;
  }
  document.getElementById("summaryPickup").textContent = pickup.value || "Vị trí hiện tại";
  document.getElementById("summaryDestination").textContent = destination.value;
  findDestination(destination.value);
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.getElementById("confirmRide").addEventListener("click", async () => {
  const selectedVehicle = document.querySelector(".vehicle-option.chosen");
  const selectedPaymentLabel = document.querySelector(".payment-option.selected strong").textContent;
  document.getElementById("receiptRoute").textContent = `${pickup.value || "Vị trí hiện tại"} → ${destination.value}`;
  document.getElementById("receiptVehicle").textContent = selectedVehicle.querySelector("strong").textContent;
  document.getElementById("receiptPayment").textContent = selectedPaymentLabel;
  document.getElementById("receiptTotal").textContent = document.getElementById("fareTotal").textContent;
  closeModal();
  document.getElementById("receiptModal").classList.add("show");
  document.getElementById("receiptModal").setAttribute("aria-hidden", "false");
  document.getElementById("receiptId").textContent = `LMG-${Date.now().toString().slice(-8)}`;
  await saveRideToSupabase();
});

async function saveRideToSupabase() {
  if (!window.limoGoSupabase) return;
  const { data: { user } } = await window.limoGoSupabase.auth.getUser();
  if (!user) return;
  const selected = document.querySelector(".vehicle-option.chosen");
  const total = Number(document.getElementById("fareTotal").textContent.replace(/\D/g, "")) || 0;
  const { data: rideData, error } = await window.limoGoSupabase.from("rides").insert({
    user_id: user.id,
    pickup_address: pickup.value || "Vị trí hiện tại",
    destination_address: destination.value,
    distance_km: routeDistance || null,
    vehicle_type: selected.querySelector("strong").textContent,
    payment_method: selectedPayment,
    promo_code: activeDiscount ? "XANH30" : null,
    subtotal: Number(document.getElementById("fareSubtotal").textContent.replace(/\D/g, "")) || total,
    discount: Number(document.getElementById("fareDiscount").textContent.replace(/\D/g, "")) || 0,
    total,
    status: "searching"
  }).select().single();
  
  if (error) {
    console.error("Không thể lưu chuyến xe:", error.message);
    return;
  }
  
  if (rideData) {
    await savePayment(rideData.id, total, selectedPayment, "completed");
    await addRewardPoints(user.id, Math.floor(total / 10000));
    setupRideNotifications(rideData.id);
  }
}

document.querySelectorAll(".payment-option").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".payment-option").forEach((item) => item.classList.remove("selected"));
    option.classList.add("selected");
    selectedPayment = option.dataset.payment;
    if (selectedPayment === "wallet") {
      const total = parseInt(document.getElementById("fareTotal").textContent.replace(/\D/g, ""), 10) || 0;
      if (total > 250000) showToast("Số dư ví không đủ cho chuyến này.");
    }
  });
});

function updatePaymentTotal() {
  const selected = document.querySelector(".vehicle-option.chosen");
  const subtotal = routeDistance ? Math.round((Number(selected.dataset.base) + Math.max(1, routeDistance) * Number(selected.dataset.km)) / 1000) * 1000 : 45000;
  const discount = activeDiscount ? Math.min(30000, Math.round(subtotal * 0.3)) : 0;
  document.getElementById("fareSubtotal").textContent = `${subtotal.toLocaleString("vi-VN")}đ`;
  document.getElementById("fareDiscount").textContent = `-${discount.toLocaleString("vi-VN")}đ`;
  document.getElementById("fareTotal").textContent = `${(subtotal - discount).toLocaleString("vi-VN")}đ`;
}

document.querySelectorAll(".vehicle-option").forEach((option) => {
  option.addEventListener("click", updatePaymentTotal);
});

document.getElementById("applyPromo").addEventListener("click", () => {
  const code = document.getElementById("promoCode");
  if (code.value.trim().toUpperCase().startsWith("XANH30")) {
    activeDiscount = 1;
    code.classList.add("valid");
    code.value = "XANH30 · Giảm 30%";
    updatePaymentTotal();
    showToast("✓ Đã áp dụng ưu đãi XANH30.");
  } else {
    activeDiscount = 0;
    updatePaymentTotal();
    showToast("Mã chưa đúng. Hãy thử XANH30.");
  }
});

document.getElementById("receiptDone").addEventListener("click", () => {
  document.getElementById("receiptModal").classList.remove("show");
  document.getElementById("receiptModal").setAttribute("aria-hidden", "true");
  document.getElementById("activeTrip").classList.add("show");
  showToast("✓ Đặt xe thành công! Tài xế đang đến đón bạn.");
});

document.getElementById("closeReceipt").addEventListener("click", () => {
  document.getElementById("receiptModal").classList.remove("show");
  document.getElementById("receiptModal").setAttribute("aria-hidden", "true");
});
document.getElementById("downloadReceipt").addEventListener("click", () => showToast("✓ Hóa đơn đã sẵn sàng để tải xuống."));

document.querySelectorAll(".vehicle-option").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".vehicle-option").forEach((item) => item.classList.remove("chosen"));
    option.classList.add("chosen");
    if (routeDistance) updateFare(routeDistance);
    document.querySelectorAll(".vehicle-option .check").forEach((check) => check.remove());
    const check = document.createElement("span");
    check.className = "check";
    check.textContent = "✓";
    option.appendChild(check);
  });
});

document.getElementById("savedPlaces").addEventListener("click", () => document.getElementById("savedPlacesPanel").classList.toggle("show"));
document.querySelectorAll("#savedPlacesPanel button").forEach((button) => {
  button.addEventListener("click", () => {
    destination.value = button.dataset.place;
    document.getElementById("savedPlacesPanel").classList.remove("show");
  });
});
document.getElementById("addStop").addEventListener("click", () => showToast("＋ Điểm dừng đã được thêm vào hành trình."));
document.querySelector(".icon-button").addEventListener("click", () => showToast("♧ Bạn không có thông báo mới."));
document.getElementById("closeTrip").addEventListener("click", () => document.getElementById("activeTrip").classList.remove("show"));
document.getElementById("trackTrip").addEventListener("click", openTracking);
document.getElementById("closeTracking").addEventListener("click", closeTracking);
document.getElementById("trackingModal").addEventListener("click", (event) => { if (event.target.id === "trackingModal") closeTracking(); });
document.getElementById("callDriver").addEventListener("click", () => showToast("☎ Đang kết nối với tài xế Nguyễn Văn Nam."));
document.getElementById("chatDriver").addEventListener("click", () => {
  document.getElementById("chatModal").classList.add("show");
  document.getElementById("chatModal").setAttribute("aria-hidden", "false");
});
document.getElementById("closeChat").addEventListener("click", () => {
  document.getElementById("chatModal").classList.remove("show");
  document.getElementById("chatModal").setAttribute("aria-hidden", "true");
});
document.getElementById("sendChat").addEventListener("click", sendChatMessage);
document.getElementById("chatInput").addEventListener("keydown", (event) => { if (event.key === "Enter") sendChatMessage(); });
function sendChatMessage() {
  const input = document.getElementById("chatInput");
  if (!input.value.trim()) return;
  const message = document.createElement("div");
  message.className = "user-message";
  message.textContent = input.value.trim();
  document.querySelector(".chat-messages").appendChild(message);
  input.value = "";
  window.setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "driver-message";
    reply.textContent = "Mình đã nhận được tin nhắn nhé.";
    document.querySelector(".chat-messages").appendChild(reply);
  }, 700);
}
document.getElementById("shareTrip").addEventListener("click", async () => {
  const shareData = { title: "Chuyến xe LimoGo", text: "Mình đang đi cùng LimoGo. Theo dõi chuyến của mình nhé!", url: window.location.href };
  if (navigator.share) await navigator.share(shareData);
  else { await navigator.clipboard?.writeText(window.location.href); showToast("✓ Đã sao chép liên kết chuyến đi."); }
});
document.getElementById("cancelTrip").addEventListener("click", () => {
  if (!window.confirm("Bạn có chắc muốn hủy chuyến này không?")) return;
  window.clearInterval(trackingTimer);
  closeTracking();
  document.getElementById("activeTrip").classList.remove("show");
  showToast("Chuyến xe đã được hủy.");
});
function openTracking() {
  const trackingModal = document.getElementById("trackingModal");
  trackingModal.classList.add("show");
  trackingModal.setAttribute("aria-hidden", "false");
  if (!trackingMap) {
    trackingMap = L.map("trackingMap", { zoomControl: false }).setView([10.785, 106.71], 14);
    L.control.zoom({ position: "bottomright" }).addTo(trackingMap);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(trackingMap);
    const pickupPoint = [10.7769, 106.7009];
    const driverStart = [10.7858, 106.7088];
    trackingPickupMarker = L.marker(pickupPoint).addTo(trackingMap).bindPopup("Điểm đón của bạn");
    trackingRoute = L.polyline([driverStart, pickupPoint], { color: "#15926a", weight: 5, dashArray: "8 8" }).addTo(trackingMap);
    driverMarker = L.marker(driverStart, { title: "Tài xế Nguyễn Văn Nam" }).addTo(trackingMap).bindPopup("Tài xế Nguyễn Văn Nam").openPopup();
    trackingMap.fitBounds([[...driverStart], [...pickupPoint]], { padding: [30, 30] });
    let progress = 0;
    trackingTimer = window.setInterval(() => {
      progress = Math.min(1, progress + 0.04);
      const current = [driverStart[0] + (pickupPoint[0] - driverStart[0]) * progress, driverStart[1] + (pickupPoint[1] - driverStart[1]) * progress];
      driverMarker.setLatLng(current);
      const minutes = Math.max(1, Math.ceil(3 * (1 - progress)));
      document.getElementById("tripEta").textContent = `${minutes} phút`;
      document.getElementById("trackingEta").textContent = progress >= 1 ? "Tài xế đã đến điểm đón" : `Còn khoảng ${minutes} phút`;
      if (progress >= 1) {
        document.getElementById("trackingStatus").textContent = "Tài xế đã đến điểm đón";
        document.getElementById("trackingTitle").textContent = "Tài xế đã đến nơi";
        document.querySelector(".tracking-info").classList.add("arrived");
        document.querySelector(".tracking-steps .current").classList.remove("current");
        document.querySelectorAll(".tracking-steps div")[2].classList.add("current");
        document.querySelectorAll(".tracking-steps div")[2].querySelector("i").textContent = "✓";
        document.querySelector(".cancel-trip").textContent = "Kết thúc theo dõi";
        window.clearInterval(trackingTimer);
      }
    }, 1800);
  }
  document.getElementById("googleDirections").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination.value || "Landmark 81")}`;
  window.setTimeout(() => {
    trackingMap.invalidateSize({ pan: false });
    if (driverMarker) driverMarker.setZIndexOffset(1000);
    if (trackingPickupMarker) trackingPickupMarker.setZIndexOffset(900);
  }, 250);
}
function closeTracking() {
  document.getElementById("trackingModal").classList.remove("show");
  document.getElementById("trackingModal").setAttribute("aria-hidden", "true");
}
document.getElementById("rideDate").min = new Date().toISOString().split("T")[0];

const utilityModal = document.getElementById("utilityModal");
const utilityData = {
  wallet: { icon: "₫", label: "TÀI CHÍNH CỦA BẠN", title: "Ví LimoGo", content: '<div class="wallet-balance"><small>SỐ DƯ KHẢ DỤNG</small><strong>250.000đ</strong><span>+ Nạp tiền &nbsp; · &nbsp; Lịch sử giao dịch</span></div><div class="utility-row"><span>♧ Điểm thưởng</span><b>1.240 điểm</b></div><div class="utility-row"><span>♙ Hạng thành viên</span><b>Green Member</b></div>' },
  history: { icon: "↺", label: "HOẠT ĐỘNG CỦA BẠN", title: "Lịch sử chuyến", content: '<div class="history-list"><div><span>⌁</span><section><strong>Landmark 81</strong><small>Hôm qua · Xe điện tiêu chuẩn</small></section><b>45.000đ</b></div><div><span>⌁</span><section><strong>Hồ Con Rùa</strong><small>20/09/2024 · Xe máy điện</small></section><b>22.000đ</b></div><div><span>⌁</span><section><strong>Sân bay Tân Sơn Nhất</strong><small>18/09/2024 · Xe điện cao cấp</small></section><b>68.000đ</b></div></div><button class="utility-action">Xem toàn bộ lịch sử</button>' },
  invite: { icon: "♧", label: "ƯU ĐÃI DÀNH CHO BẠN", title: "Mời bạn bè cùng đi", content: '<div class="invite-box"><strong>Nhận 30.000đ</strong><p>Mời bạn bè đăng ký LimoGo. Cả hai cùng nhận ưu đãi cho chuyến đầu tiên.</p><div><b>LIMOGO30</b><button class="copy-code">Sao chép</button></div></div><button class="utility-action">Chia sẻ lời mời</button>' },
  support: { icon: "?", label: "TRUNG TÂM HỖ TRỢ", title: "Bạn cần giúp gì?", content: '<div class="support-list"><button><span>♧</span><section><strong>Trò chuyện với LimoGo</strong><small>Phản hồi trong khoảng 1 phút</small></section><b>›</b></button><button><span>☎</span><section><strong>Gọi tổng đài hỗ trợ</strong><small>1900 1234 · Hoạt động 24/7</small></section><b>›</b></button><button><span>?</span><section><strong>Câu hỏi thường gặp</strong><small>Hướng dẫn sử dụng dịch vụ</small></section><b>›</b></button></div>' }
};
document.querySelectorAll(".quick-card").forEach((card) => card.addEventListener("click", () => {
  const data = utilityData[card.dataset.panel];
  document.getElementById("utilityIcon").textContent = data.icon;
  document.getElementById("utilityLabel").textContent = data.label;
  document.getElementById("utilityTitle").textContent = data.title;
  document.getElementById("utilityContent").innerHTML = data.content;
  utilityModal.classList.add("show");
  utilityModal.setAttribute("aria-hidden", "false");
  const copyButton = utilityModal.querySelector(".copy-code");
  if (copyButton) copyButton.addEventListener("click", () => { navigator.clipboard?.writeText("LIMOGO30"); showToast("✓ Đã sao chép mã LIMOGO30."); });
}));
function closeUtility() { utilityModal.classList.remove("show"); utilityModal.setAttribute("aria-hidden", "true"); }
document.getElementById("closeUtility").addEventListener("click", closeUtility);
utilityModal.addEventListener("click", (event) => { if (event.target === utilityModal) closeUtility(); });

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3500);
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll(".auth-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.auth === mode));
  document.querySelectorAll(".register-only").forEach((field) => field.classList.toggle("visible", mode === "register"));
  document.getElementById("authTitle").textContent = mode === "register" ? "Tạo tài khoản mới" : "Đăng nhập tài khoản";
  document.getElementById("authSubtitle").textContent = mode === "register" ? "Đăng ký để nhận ưu đãi và quản lý chuyến đi dễ dàng." : "Đăng nhập để lưu địa điểm và theo dõi chuyến đi.";
  document.getElementById("authSubmit").firstChild.textContent = mode === "register" ? "Đăng ký " : "Đăng nhập ";
  document.getElementById("authMessage").textContent = "";
}

function openAuth() {
  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden", "false");
  document.getElementById("email").focus();
}

function closeAuth() {
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden", "true");
  authForm.reset();
  setAuthMode("login");
}

document.getElementById("accountButton").addEventListener("click", openAuth);
document.getElementById("closeAuth").addEventListener("click", closeAuth);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuth();
});
document.querySelectorAll(".auth-tab").forEach((tab) => tab.addEventListener("click", () => setAuthMode(tab.dataset.auth)));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("authMessage");
  if (authMode === "register") {
    const name = document.getElementById("fullName").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (!name) { message.textContent = "Vui lòng nhập họ và tên."; return; }
    if (password !== confirmPassword) { message.textContent = "Mật khẩu nhập lại chưa khớp."; return; }
    if (!window.limoGoSupabase) {
      message.textContent = "Chưa kết nối được Supabase.";
      return;
    }
    const { data, error } = await window.limoGoSupabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) {
      message.textContent = error.message;
      return;
    }
    if (data.user) updateAccount({ name, email });
    message.textContent = data.session ? "Đăng ký thành công, bạn đã được đăng nhập." : "Đăng ký thành công. Hãy kiểm tra email để xác nhận.";
    if (data.session) window.setTimeout(closeAuth, 700);
    return;
  }
  if (!window.limoGoSupabase) {
    message.textContent = "Chưa kết nối được Supabase.";
    return;
  }
  const { data, error } = await window.limoGoSupabase.auth.signInWithPassword({ email, password });
  if (error) {
    message.textContent = "Email hoặc mật khẩu chưa chính xác.";
    return;
  }
  const name = data.user.user_metadata?.full_name || email.split("@")[0];
  updateAccount({ name, email });
  closeAuth();
  showToast("✓ Đăng nhập thành công. Chào mừng bạn trở lại!");
});

function updateAccount(user) {
  document.getElementById("accountName").textContent = user.name;
  document.getElementById("accountAvatar").textContent = user.name.split(" ").map((part) => part[0]).slice(-2).join("").toUpperCase();
  document.getElementById("mobileUserName").textContent = `${user.name.split(" ")[0]} 👋`;
}

if (window.limoGoSupabase) {
  window.limoGoSupabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      const user = data.session.user;
      updateAccount({ name: user.user_metadata?.full_name || user.email.split("@")[0], email: user.email });
    }
  });
}
