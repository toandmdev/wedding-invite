// =========================================================
// Wedding Invite — main.js
// =========================================================

(function () {
  "use strict";

  /* ---------- 1. Lấy tên khách mời từ URL ----------
     Link cá nhân hoá dạng:
     https://ten-mien-cua-ban.vercel.app/?to=Nguyen%20Van%20A
     Cũng hỗ trợ ?name=... và ?khachmoi=MÃ (mã riêng theo dõi từng khách,
     không hiển thị, dùng để bạn biết link nào ứng với khách nào nếu cần).
     Thêm dấu "+" ở cuối tên (vd: ?name=Toan+) sẽ hiển thị "và người thân".
     Xem generate-links.html để tạo hàng loạt link cho danh sách khách.
  --------------------------------------------------- */
  function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    // URLSearchParams đã tự giải mã %20/+/%2B đúng chuẩn, không cần xử lý thêm.
    const raw = params.get("to") || params.get("name") || params.get("ten");
    if (!raw) return null;
    let cleaned = raw.trim();
    if (!cleaned.length) return null;

    const plusOne = /\+\s*$/.test(cleaned);
    if (plusOne) cleaned = cleaned.replace(/\+\s*$/, "").trim();
    if (plusOne) cleaned = `${cleaned} và người thân`;
    return cleaned;
  }

  const guestCode = new URLSearchParams(window.location.search).get("khachmoi");

  // Bên đang xem thiệp — dùng chung cho cả địa chỉ tư gia, tên buổi lễ, giờ lễ
  // mặc định và ngày đếm ngược/Âm lịch bên dưới, để link khách mời chỉ cần
  // mang theo "?ben=trai|gai&to=Tên" là đủ, không phải nhét giờ/địa chỉ vào
  // từng link nữa.
  const ben = (new URLSearchParams(window.location.search).get("ben") || "gai").toLowerCase();

  const guestName = getGuestName();
  const fallbackName = "Quý khách";
  const displayName = guestName || fallbackName;

  document.querySelectorAll("#guestNameEnvelope, #guestNameHero, #rsvpThanksName")
    .forEach((el) => { if (el) el.textContent = displayName; });

  if (guestName) {
    document.title = `Thiệp mời ${guestName} — Mạnh Toản & Thanh Kim`;
    // Điền sẵn tên khách vào ô "Họ và tên" của form RSVP và sổ lưu bút
    // để khách đỡ phải gõ lại — họ vẫn có thể sửa nếu muốn.
    const rsvpNameEl = document.getElementById("rsvpName");
    const gbNameEl = document.getElementById("gbName");
    if (rsvpNameEl) rsvpNameEl.value = guestName;
    if (gbNameEl) gbNameEl.value = guestName;
  }

  /* ---------- 1b. Bên nhà trai/nhà gái + giờ lễ & tiệc — chỉnh không cần sửa code ----------
     Một thiệp dùng chung cho cả nhà trai và nhà gái, nhưng mỗi bên chỉ tổ
     chức "Tiệc Chung Vui" + một buổi lễ riêng (nhà gái: Lễ Vu Quy — nhà
     trai: Lễ Thành Hôn), và giờ giấc mỗi bên khác nhau. Tất cả được ghi đè
     qua tham số trên URL thay vì phải sửa file index.html:
       ben         = "gai" hoặc "trai" — quyết định tên buổi lễ hiển thị
                     (mặc định "Lễ Vu Quy" nếu để trống/= "gai")
       le_label    = tự đặt tên buổi lễ khác đi nếu muốn (ghi đè cả "ben")
       le_gio      = giờ + ngày buổi lễ      (vd: "Vào lúc 9:00<br/>Thứ Bảy, 24/10/2026")
       le_diadiem  = địa điểm buổi lễ, hiện sau chữ "Tại:" (dùng \n cho xuống dòng, ví dụ %0A)
       le_map      = link Google Maps cho nút "Chỉ đường" của buổi lễ
       tiec_gio    = giờ + ngày Tiệc Chung Vui
       tiec_diadiem= địa điểm Tiệc Chung Vui, hiện sau chữ "Tại:"
       tiec_map    = link Google Maps cho nút "Chỉ đường" của tiệc
     Dùng công cụ generate-links.html (mục "Cài đặt ngày giờ & địa điểm") để
     chọn bên + nhập giờ một lần rồi tự động sinh link đúng cho cả danh sách
     khách — không cần đụng vào code, và nhiều khách cùng giờ chỉ cần tạo 1 lần.
  --------------------------------------------------- */
  // Địa chỉ + link bản đồ cố định của tư gia hai bên — cả "Tiệc Chung Vui" lẫn
  // buổi lễ đều tổ chức tại nhà riêng của đúng bên đang xem thiệp (theo "ben"),
  // nên dùng chung 2 hằng số này thay vì gõ lặp lại địa chỉ ở nhiều chỗ.
  const HOME_TRAI = {
    label: "Tư gia nhà trai",
    address: "Thôn Anh Trỗi, Xã Quỳnh Lưu<br/>Tỉnh Ninh Bình",
    map: "https://maps.app.goo.gl/PxKXKRXbYkmxokgb9",
  };
  const HOME_GAI = {
    label: "Tư gia nhà gái",
    address: "Xóm 1 Lỗi Sơn, Xã Gia Phong<br/>Tỉnh Ninh Bình",
    map: "https://maps.app.goo.gl/Xgu69FonJWdBbjfi9",
  };

  // Giờ buổi lễ cố định theo từng bên (Lễ Thành Hôn nhà trai 9h30, Lễ Vu Quy
  // nhà gái 8h00, cùng ngày 25/10/2026) — khác với Tiệc Chung Vui (giờ có thể
  // đổi theo từng đợt khách nên vẫn dùng ?tiec_gio=... như trước), giờ lễ là
  // cố định nên gắn thẳng vào đây, khỏi phải lặp lại trong từng link khách mời.
  const EVENT_LE = {
    trai: { time: "Vào lúc 9:30<br/>Chủ nhật, 25/10/2026", isoDate: "2026-10-25T09:30:00+07:00" },
    gai: { time: "Vào lúc 8:00<br/>Chủ nhật, 25/10/2026", isoDate: "2026-10-25T08:00:00+07:00" },
  };

  (function applyEventOverrides() {
    const p = new URLSearchParams(window.location.search);
    const setText = (id, key) => {
      const val = p.get(key);
      if (!val) return;
      const el = document.getElementById(id);
      if (el) el.innerHTML = val.replace(/\n/g, "<br/>");
    };
    const setHref = (id, key) => {
      const val = p.get(key);
      if (!val) return;
      const el = document.getElementById(id);
      if (el) el.href = val;
    };
    const fillHome = (prefix, home) => {
      const labelEl = document.getElementById(`${prefix}PlaceLabel`);
      const placeEl = document.getElementById(`${prefix}Place`);
      const linkEl = document.getElementById(`${prefix}MapLink`);
      if (labelEl) labelEl.textContent = home.label;
      if (placeEl) placeEl.innerHTML = home.address;
      if (linkEl) linkEl.href = home.map;
    };

    const home = ben === "trai" ? HOME_TRAI : HOME_GAI;

    // Mặc định: cả Tiệc Chung Vui và buổi lễ đều ở tư gia của đúng "ben" —
    // ?tiec_diadiem=/?le_diadiem=... (và các tham số khác bên dưới) vẫn ghi đè
    // được nếu một buổi lễ nào đó cần đổi riêng.
    fillHome("eventTiec", home);
    fillHome("eventLe", home);

    const defaultLeLabel = ben === "trai" ? "Lễ Thành Hôn" : "Lễ Vu Quy";
    const leLabelEl = document.getElementById("eventLeLabel");
    if (leLabelEl) leLabelEl.textContent = p.get("le_label") || defaultLeLabel;

    // Giờ lễ mặc định theo bên (9h30 nhà trai / 8h00 nhà gái) — vẫn cho phép
    // ?le_gio=... ghi đè riêng nếu một khách/đợt nào đó cần giờ khác.
    const leInfo = EVENT_LE[ben] || EVENT_LE.gai;
    const leTimeEl = document.getElementById("eventLeTime");
    if (leTimeEl) leTimeEl.innerHTML = leInfo.time;

    setText("eventLeTime", "le_gio");
    setText("eventLePlace", "le_diadiem");
    setHref("eventLeMapLink", "le_map");
    setText("eventTiecTime", "tiec_gio");
    setText("eventTiecPlace", "tiec_diadiem");
    setHref("eventTiecMapLink", "tiec_map");
  })();

  /* ---------- 2. Envelope intro ---------- */
  const envelopeScreen = document.getElementById("envelope-screen");
  const openBtn = document.getElementById("openInviteBtn");
  document.body.classList.add("locked");

  function openInvite() {
    envelopeScreen.classList.add("hidden");
    document.body.classList.remove("locked");
    // Tự phát nhạc nền ngay khi khách bấm "Mở thiệp mời" — đây là một cú
    // click thật của người dùng nên hầu hết trình duyệt sẽ cho phép autoplay.
    // Lưu ý: nhạc nền được khai báo bằng thẻ <source> lồng trong <audio>,
    // nên music.src luôn rỗng (chỉ đọc được qua currentSrc/thẻ <source>) —
    // trước đây kiểm tra music.src khiến đoạn này không bao giờ chạy dù đã
    // có file nhạc. Giờ kiểm tra đúng qua thẻ <source>.
    const music = document.getElementById("bgMusic");
    const hasSource = music && music.querySelector("source[src]") &&
      music.querySelector("source[src]").getAttribute("src");
    if (music && hasSource) {
      music.volume = 0.5;
      const tryPlay = () => music.play().then(() => {
        const toggle = document.getElementById("musicToggle");
        if (toggle) toggle.classList.add("playing");
        return true;
      }).catch(() => false);

      tryPlay().then((ok) => {
        if (ok) return;
        // Trên site đã deploy (không còn là file:// local), file nhạc cần tải qua mạng
        // nên lần play() đầu tiên (ngay lúc bấm mở thiệp) đôi khi chưa kịp sẵn sàng và
        // bị trình duyệt từ chối. Thay vì bắt khách phải tự tìm nút nhạc bấm lại nhiều
        // lần, ta lắng nghe cú chạm/click kế tiếp bất kỳ trên trang và thử play() lại
        // đúng 1 lần — vẫn tính là trong ngữ cảnh tương tác của người dùng nên trình
        // duyệt sẽ cho phép.
        const retry = () => {
          document.removeEventListener("click", retry);
          document.removeEventListener("touchend", retry);
          tryPlay();
        };
        document.addEventListener("click", retry, { once: true });
        document.addEventListener("touchend", retry, { once: true });
      });
    }
    window.removeEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Enter" || e.key === " ") openInvite(); }

  if (openBtn) openBtn.addEventListener("click", openInvite);
  window.addEventListener("keydown", onKey);

  /* ---------- 3. Music toggle thủ công ---------- */
  const musicBtn = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  if (musicBtn && bgMusic) {
    musicBtn.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicBtn.classList.add("playing");
      } else {
        bgMusic.pause();
        musicBtn.classList.remove("playing");
      }
    });
  }

  /* ---------- 4. Scroll reveal (hiện dần khi cuộn xuống) ----------
     Mỗi phần tử có class .reveal sẽ mờ dần + trượt lên khi lọt vào
     khung nhìn. Các phần tử nằm cùng nhóm (timeline, ảnh, sự kiện,
     thẻ mừng cưới...) sẽ xuất hiện lần lượt cách nhau 1 nhịp (stagger)
     thay vì bung ra cùng lúc, tạo cảm giác "gõ nhịp" hiện đại hơn.
  --------------------------------------------------- */
  const staggerGroups = [
    ".gallery-grid", ".events-grid", ".gift-cards", ".timer", ".family-grid",
  ];
  staggerGroups.forEach((sel) => {
    document.querySelectorAll(sel).forEach((group) => {
      const items = group.querySelectorAll(":scope > .reveal");
      items.forEach((item, i) => {
        item.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 110}ms`);
      });
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => io.observe(el));

  /* ---------- 6. Ngày giờ cưới + Countdown timer ----------
     Nhà trai và nhà gái tổ chức lễ/tiệc vào 2 ngày khác nhau (24/10 và
     25/10/2026), nên "ngày cưới" dùng để đếm ngược / tính Âm lịch / tạo
     link Google Calendar KHÔNG cố định một mốc duy nhất trong code nữa.
     Mặc định bên dưới dùng cho lúc xem thử trang gốc (không có link riêng).
     Mỗi link khách mời (sinh ra từ generate-links.html) có thể mang theo
     tham số `?ngay=2026-10-25T09:00:00+07:00` để trang tự đếm ngược / tính
     Âm lịch đúng theo ngày của bên đó — không cần sửa file này.
  --------------------------------------------------- */
  // Mặc định lấy theo giờ lễ cố định của đúng "ben" (xem EVENT_LE ở trên) —
  // ?ngay=... vẫn ghi đè được nếu cần chỉnh riêng cho một link cụ thể.
  const DEFAULT_WEDDING_DATE = new Date((EVENT_LE[ben] || EVENT_LE.gai).isoDate);
  const ngayParam = new URLSearchParams(window.location.search).get("ngay");
  const parsedNgay = ngayParam ? new Date(ngayParam) : null;
  const WEDDING_DATE = (parsedNgay && !isNaN(parsedNgay.getTime())) ? parsedNgay : DEFAULT_WEDDING_DATE;

  const VN_WEEKDAYS = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  function formatVNDate(date) {
    const weekday = VN_WEEKDAYS[date.getDay()];
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${weekday}, ${dd}/${mm}/${date.getFullYear()}`;
  }
  // Ô ngày dưới "Save The Date" chỉ hiện số ngày.tháng.năm (dạng "25 . 10 . 2026"),
  // luôn tính theo WEDDING_DATE hiệu lực (mặc định hoặc ghi đè qua ?ngay=...).
  const heroDateEl = document.getElementById("heroDateLine");
  if (heroDateEl) {
    const dd2 = String(WEDDING_DATE.getDate()).padStart(2, "0");
    const mm2 = String(WEDDING_DATE.getMonth() + 1).padStart(2, "0");
    heroDateEl.textContent = `${dd2} . ${mm2} . ${WEDDING_DATE.getFullYear()}`;
  }
  const countdownDateEl = document.getElementById("countdownDateLine");
  if (countdownDateEl) {
    // Tách thành 2 dòng: "Đếm ngược đến ngày cưới" và ngày/thứ bên dưới.
    countdownDateEl.innerHTML = `Đếm ngược đến ngày cưới<br />${formatVNDate(WEDDING_DATE)}`;
  }

  /* ---------- 6b. Lịch tháng đánh dấu ngày cưới (giống mẫu tham khảo) ----------
     Vẽ lưới lịch của đúng tháng có ngày cưới, khoanh tròn + gắn icon 💗 vào
     đúng ngày (lấy từ WEDDING_DATE ở trên, đã tính theo link ?ngay=... nếu có).
  --------------------------------------------------- */
  (function renderWeddingCalendar() {
    const monthLabelEl = document.getElementById("calMonthLabel");
    const gridEl = document.getElementById("calGrid");
    if (!monthLabelEl || !gridEl) return;

    const year = WEDDING_DATE.getFullYear();
    const month = WEDDING_DATE.getMonth(); // 0-indexed
    const weddingDay = WEDDING_DATE.getDate();
    monthLabelEl.textContent = `Tháng ${month + 1}`;

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Tuần bắt đầu từ Thứ 2 (T2..CN) — getDay() trả 0=CN..6=T7, quy đổi về 0=T2..6=CN.
    const startOffset = (firstDay.getDay() + 6) % 7;

    let html = "";
    ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach((w) => {
      html += `<div class="cal-weekday">${w}</div>`;
    });
    for (let i = 0; i < startOffset; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isWedding = d === weddingDay;
      html += `<div class="cal-day${isWedding ? " is-wedding-day" : ""}">${isWedding ? '<span class="cal-heart">♥</span>' : ""}${d}</div>`;
    }
    gridEl.innerHTML = html;
  })();

  function pad(n) { return String(n).padStart(2, "0"); }

  function updateCountdown() {
    const now = new Date();
    let diff = WEDDING_DATE.getTime() - now.getTime();
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    const sEl = document.getElementById("cd-secs");
    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- 7. Add to Google Calendar ---------- */
  const addCalendarBtn = document.getElementById("addCalendarBtn");
  if (addCalendarBtn) {
    // Tự tính giờ bắt đầu/kết thúc (định dạng UTC) từ WEDDING_DATE ở trên,
    // mặc định sự kiện kéo dài 3 tiếng — không còn ghi cứng ngày/giờ ở đây.
    const toUTCStamp = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const start = toUTCStamp(WEDDING_DATE);
    const end = toUTCStamp(new Date(WEDDING_DATE.getTime() + 3 * 60 * 60 * 1000));
    const text = encodeURIComponent("Lễ cưới Mạnh Toản & Thanh Kim");
    const details = encodeURIComponent("Trân trọng kính mời bạn đến chung vui cùng chúng tôi.");
    const location = encodeURIComponent("TP. Hồ Chí Minh");
    addCalendarBtn.href =
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
  }

  /* ---------- 8. RSVP form (demo) ---------- */
  // "Bạn là khách mời của" — bấm để chọn Chú Rể / Cô Dâu, lưu vào ô ẩn #rsvpSide
  const sideButtons = document.querySelectorAll(".side-btn");
  const rsvpSideInput = document.getElementById("rsvpSide");
  sideButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sideButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (rsvpSideInput) rsvpSideInput.value = btn.dataset.side;
    });
  });
  // Nếu link đã mang sẵn ?ben=trai|gai, chọn sẵn đúng bên cho khách — họ vẫn
  // có thể bấm đổi lại nếu mình gõ nhầm khi tạo thiệp.
  {
    const benParam = (new URLSearchParams(window.location.search).get("ben") || "").toLowerCase();
    const wantedSide = benParam === "trai" ? "groom" : (benParam === "gai" ? "bride" : null);
    if (wantedSide) {
      const match = Array.from(sideButtons).find((b) => b.dataset.side === wantedSide);
      if (match) {
        sideButtons.forEach((b) => b.classList.remove("active"));
        match.classList.add("active");
        if (rsvpSideInput) rsvpSideInput.value = wantedSide;
      }
    }
  }

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpThanks = document.getElementById("rsvpThanks");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(rsvpForm);
      const name = data.get("name") || displayName;
      const sideLabel = data.get("side") === "bride" ? "Cô Dâu" : "Chú Rể";

      // DEMO: mở email mặc định với nội dung phản hồi.
      // Khi triển khai thật, hãy thay đoạn này bằng fetch() gửi tới
      // Google Form / Google Sheet / một API RSVP (xem README.md).
      const subject = encodeURIComponent(`RSVP - ${name}`);
      const bodyLines = [
        `Họ tên: ${name}`,
        `SĐT: ${data.get("phone") || ""}`,
        `Khách mời của: ${sideLabel}`,
        `Tham dự: ${data.get("attend")}`,
        `Số người đi cùng: ${data.get("guests") || 0}`,
        `Lời chúc: ${data.get("message") || ""}`,
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));
      // window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

      document.getElementById("rsvpThanksName").textContent = name;
      rsvpForm.hidden = true;
      rsvpThanks.hidden = false;
    });
  }

  /* ---------- 9. QR chuyển khoản mừng cưới (chuẩn VietQR) ----------
     Bấm nút → tạo (hoặc lấy lại) mã QR VietQR từ số tài khoản, ngân
     hàng, tên chủ tài khoản trong data-* của nút → hiện khung QR.
     Bấm lại lần nữa → đóng khung QR. Mã QR quét được bằng hầu hết
     app ngân hàng / ví điện tử tại Việt Nam có hỗ trợ VietQR.
  --------------------------------------------------- */
  function crc16ccitt(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return crc & 0xffff;
  }

  function tlv(id, value) {
    const len = String(value.length).padStart(2, "0");
    return `${id}${len}${value}`;
  }

  // amount: để trống = số tiền mở (người chuyển tự nhập trong app)
  function buildVietQRPayload({ bin, account, name, purpose, amount }) {
    let p = "";
    p += tlv("00", "01"); // Payload Format Indicator
    p += tlv("01", amount ? "12" : "11"); // static (11) / dynamic (12)
    const beneficiaryOrg = tlv("00", bin) + tlv("01", account);
    const merchantInfo = tlv("00", "A000000727") + tlv("01", beneficiaryOrg) + tlv("02", "QRIBFTTA");
    p += tlv("38", merchantInfo); // Merchant Account Info (VietQR / Napas)
    p += tlv("53", "704"); // Currency: VND
    if (amount) p += tlv("54", String(amount));
    p += tlv("58", "VN"); // Country code
    if (name) p += tlv("59", name.slice(0, 25).toUpperCase());
    if (purpose) p += tlv("62", tlv("08", purpose.slice(0, 25)));
    p += "6304"; // CRC tag + length, giá trị tính ngay sau
    const crc = crc16ccitt(p).toString(16).toUpperCase().padStart(4, "0");
    return p + crc;
  }

  function renderQrInto(imgEl, payload) {
    if (typeof qrcode !== "function") return; // thư viện chưa tải được
    const qr = qrcode(0, "M"); // type 0 = auto chọn kích thước phù hợp
    qr.addData(payload, "Byte");
    qr.make();
    imgEl.src = qr.createDataURL(8, 8);
  }

  // QR được tạo sẵn ngay khi mở popup "Hộp Mừng Cưới" (xem initGiftModal bên dưới),
  // không cần bấm thêm nút "Xem mã QR" nữa.
  let giftQrGenerated = false;
  function generateAllGiftQr() {
    if (giftQrGenerated) return;
    document.querySelectorAll(".gift-card").forEach((card) => {
      const img = card.querySelector(".qr-box img");
      if (!img) return;
      const payload = buildVietQRPayload({
        bin: card.dataset.bin,
        account: card.dataset.account,
        name: card.dataset.name,
        purpose: card.dataset.purpose,
      });
      renderQrInto(img, payload);
    });
    giftQrGenerated = true;
  }

  /* ---------- 10. Nút copy số tài khoản ---------- */
  document.querySelectorAll(".btn-copy").forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        // Trình duyệt cũ / không hỗ trợ clipboard API — bỏ qua, người dùng tự chép từ ảnh QR.
      }
      btn.textContent = "✅ Đã copy số tài khoản!";
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });

  /* ---------- 10b. Nút tải ảnh QR ---------- */
  document.querySelectorAll("[data-download]").forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener("click", () => {
      const panel = btn.closest(".qr-panel");
      const img = panel ? panel.querySelector(".qr-box img") : null;
      if (!img || !img.src || !img.src.startsWith("data:")) {
        // Ảnh QR chưa được tạo (người dùng chưa bấm "Xem mã QR") — báo cho biết.
        btn.textContent = "⚠ Hãy mở mã QR trước";
        setTimeout(() => { btn.textContent = original; }, 1800);
        return;
      }
      const link = document.createElement("a");
      link.href = img.src;
      link.download = btn.dataset.downloadName || "qr-chuyen-khoan.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      btn.textContent = "✅ Đã tải ảnh QR!";
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });

  /* ---------- 11. Ngày cưới theo Âm lịch ----------
     Dùng thư viện âm lịch Việt Nam (assets/js/vendor/vn-lunar.min.js,
     dựa trên thuật toán Hồ Ngọc Đức) để tự tính, không cần nhập tay.
  --------------------------------------------------- */
  function renderLunarDate() {
    if (!window.VNLunar || typeof window.VNLunar.LunarDate !== "function") return;
    try {
      const lunar = new window.VNLunar.LunarDate(new Date(WEDDING_DATE));
      const leapText = lunar.isLeap ? " (nhuận)" : "";
      const long = `Tức ngày ${lunar.date} tháng ${lunar.month}${leapText} năm ${lunar.lunarYear.can} ${lunar.lunarYear.chi} (Âm lịch)`;
      // Cả buổi lễ lẫn Tiệc Chung Vui hiện đều tính theo cùng một WEDDING_DATE,
      // nên dùng chung một dòng Âm lịch cho cả hai khung sự kiện.
      const tiecLunarEl = document.getElementById("eventTiecLunar");
      const leLunarEl = document.getElementById("eventLeLunar");
      if (tiecLunarEl) tiecLunarEl.textContent = long;
      if (leLunarEl) leLunarEl.textContent = long;
    } catch (err) {
      // Nếu thư viện lỗi vì lý do gì đó, chỉ ẩn dòng âm lịch đi, không ảnh hưởng phần còn lại của trang.
      document.querySelectorAll("#eventTiecLunar, #eventLeLunar").forEach((el) => { if (el) el.hidden = true; });
    }
  }
  renderLunarDate();

  /* ---------- 12. Sổ lưu bút (Guestbook) ----------
     Bản demo: lời chúc được lưu tạm trong bộ nhớ trình duyệt của người
     xem (mất khi tải lại trang) — không có backend nên chưa hiển thị
     lời chúc thật của các khách khác cho nhau xem. Xem README mục
     "Sổ lưu bút" để nối vào Google Sheet cho lời chúc lưu thật & công khai.
  --------------------------------------------------- */
  const SAMPLE_WISHES = [
    { name: "Gia đình hai bên", message: "Chúc hai con trăm năm hạnh phúc, sớm có tin vui!" },
    { name: "Hải & Linh", message: "Chúc Mạnh Toản và Thanh Kim mãi yêu thương như ngày đầu 💕" },
  ];

  function renderWishCard(wish) {
    const wall = document.getElementById("guestbookWall");
    if (!wall) return;
    const card = document.createElement("div");
    card.className = "wish-card in-view";
    const safeName = wish.name.replace(/[<>]/g, "");
    const safeMsg = wish.message.replace(/[<>]/g, "");
    card.innerHTML = `<p class="wish-msg">${safeMsg}</p><p class="wish-name">— ${safeName}</p>`;
    wall.prepend(card);
  }

  SAMPLE_WISHES.forEach(renderWishCard);

  const guestbookForm = document.getElementById("guestbookForm");
  if (guestbookForm) {
    guestbookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameEl = document.getElementById("gbName");
      const msgEl = document.getElementById("gbMessage");
      const name = (nameEl.value || displayName).trim();
      const message = msgEl.value.trim();
      if (!message) return;
      renderWishCard({ name, message });
      msgEl.value = "";
      // DEMO: chưa gửi đi đâu lưu trữ lâu dài. Khi có backend (Google Sheet/API),
      // thêm 1 lệnh fetch(...) ở đây để lưu lời chúc thật (xem README.md).
    });
  }

  /* ---------- 13. Gallery: nút "Xem thêm" + Lightbox xem ảnh lớn (next/prev) ---------- */
  (function initGallery() {
    const grid = document.getElementById("galleryGrid");
    const extraGrid = document.getElementById("galleryExtraGrid");
    if (!grid) return;
    // Gộp cả ảnh bento chính + ảnh trong lưới "xem thêm" (nếu có) theo đúng thứ tự trong DOM,
    // để lightbox next/prev chạy xuyên suốt toàn bộ album chứ không chỉ 6 ảnh đầu.
    const items = Array.from(document.querySelectorAll("#gallery .gallery-item"));
    const photos = items.map((item) => {
      const img = item.querySelector("img");
      return img ? img.getAttribute("src") : "";
    });

    // Nút "Xem thêm ảnh": chỉ hiện nếu có lưới ảnh phụ, bấm vào mới hiện các ảnh còn lại
    const moreWrap = document.getElementById("galleryMoreWrap");
    const moreBtn = document.getElementById("galleryMoreBtn");
    if (moreWrap) {
      if (!extraGrid || !extraGrid.querySelector(".gallery-item")) {
        moreWrap.classList.add("is-hidden");
      } else if (moreBtn) {
        moreBtn.addEventListener("click", () => {
          extraGrid.classList.add("is-visible");
          moreWrap.classList.add("is-hidden");
        });
      }
    }

    // Lightbox
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCount = document.getElementById("lightboxCount");
    const btnClose = document.getElementById("lightboxClose");
    const btnPrev = document.getElementById("lightboxPrev");
    const btnNext = document.getElementById("lightboxNext");
    if (!lightbox || !lightboxImg) return;

    let currentIdx = 0;

    function showPhoto(idx) {
      if (!photos.length) return;
      currentIdx = (idx + photos.length) % photos.length;
      lightboxImg.src = photos[currentIdx];
      if (lightboxCount) lightboxCount.textContent = `${currentIdx + 1} / ${photos.length}`;
    }

    function openLightbox(idx) {
      showPhoto(idx);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    items.forEach((item, idx) => {
      item.addEventListener("click", () => openLightbox(idx));
    });

    if (btnClose) btnClose.addEventListener("click", closeLightbox);
    if (btnPrev) btnPrev.addEventListener("click", () => showPhoto(currentIdx - 1));
    if (btnNext) btnNext.addEventListener("click", () => showPhoto(currentIdx + 1));

    // Bấm ra ngoài ảnh (vùng nền tối) để đóng
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Điều hướng bằng bàn phím khi lightbox đang mở
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPhoto(currentIdx - 1);
      else if (e.key === "ArrowRight") showPhoto(currentIdx + 1);
    });

    // Vuốt trái/phải trên điện thoại để chuyển ảnh
    let touchStartX = null;
    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) showPhoto(currentIdx + (dx < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });
  })();

  /* ---------- 13b. Popup "Hộp Mừng Cưới" — chỉ hiện STK/QR khi bấm nút mở ---------- */
  (function initGiftModal() {
    const openBtn = document.getElementById("giftOpenBtn");
    const modal = document.getElementById("giftModal");
    const closeBtn = document.getElementById("giftModalClose");
    if (!openBtn || !modal) return;

    function openGiftModal() {
      generateAllGiftQr();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeGiftModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    openBtn.addEventListener("click", openGiftModal);
    if (closeBtn) closeBtn.addEventListener("click", closeGiftModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeGiftModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeGiftModal();
    });
  })();

})();
