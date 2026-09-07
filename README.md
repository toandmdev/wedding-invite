# 💌 Website Thiệp Cưới — Mạnh Toản & Thanh Kim (Demo)

Đây là bản demo website thiệp cưới, phong cách hiện đại - tối giản, responsive
(chạy tốt trên điện thoại, tablet, desktop), có các hiệu ứng: mở phong bì mời,
cuộn hiện dần (scroll reveal), đếm ngược ngày cưới (kèm ngày Âm lịch tự tính),
nhạc nền, album ảnh, thông tin hai gia đình, sổ lưu bút, dress code, form RSVP,
QR chuyển khoản mừng cưới (chuẩn VietQR), và **link thiệp riêng cho từng khách mời**.

Toàn bộ là HTML/CSS/JS thuần (không cần cài đặt, không cần build) nên có thể
deploy miễn phí trong vài phút.

---

## 1. Cấu trúc thư mục

```
wedding-invite/
├── index.html            → Trang thiệp chính
├── generate-links.html   → Công cụ tạo link riêng cho từng khách (mở bằng trình duyệt)
├── guests.csv            → File mẫu danh sách khách mời
├── assets/
│   ├── css/style.css     → Toàn bộ giao diện, màu sắc, hiệu ứng
│   ├── js/main.js        → Đếm ngược, hiệu ứng, RSVP, QR chuyển khoản, sổ lưu bút, đọc tên khách từ link
│   ├── js/vendor/         → Thư viện tạo mã QR & tính ngày Âm lịch (không cần chỉnh sửa)
│   ├── img/               → (bạn tự thêm ảnh cưới vào đây)
│   └── audio/             → (bạn tự thêm nhạc nền bg-music.mp3 vào đây, không bắt buộc)
└── README.md
```

## 2. Cách chỉnh sửa nội dung (không cần biết code)

Mở `index.html` bằng Notepad / VS Code, tìm và sửa các đoạn sau:

- Tên cô dâu chú rể: tìm `Mạnh Toản` và `Thanh Kim`, thay bằng tên thật.
- Ngày giờ cưới mặc định (dùng khi mở thẳng file, không qua link riêng): sửa
  trong `assets/js/main.js`, dòng
  `const DEFAULT_WEDDING_DATE = new Date("2026-10-25T08:00:00+07:00");`
  (giữ định dạng `+07:00` cho múi giờ Việt Nam). Phần "Save the date",
  đếm ngược, ngày Âm lịch và link "Thêm vào Google Calendar" đều **tự tính**
  từ ngày này — không cần sửa tay từng chỗ.
- Địa điểm, giờ Lễ Vu Quy / Lễ Thành Hôn / Tiệc Chung Vui (mặc định): sửa
  trong phần `<section id="events">`. Ngày Âm lịch bên dưới ngày cưới (cả ở
  trang bìa và phần sự kiện) **tự động tính ra** từ đúng `DEFAULT_WEDDING_DATE`
  bạn sửa ở bước trên — không cần tự tra và gõ tay ngày âm.
  **Vì nhà trai và nhà gái mời tiệc khác giờ** (Lễ Vu Quy 8h và Lễ Thành Hôn
  9h30 chẳng hạn), bạn KHÔNG cần sửa file này hai lần — xem mục 3 bên dưới để
  chỉnh bằng một ô nhập liệu, mỗi bên một link riêng.
- Dress code: sửa dòng gợi ý màu trang phục trong `<section id="events">`,
  đoạn có class `dresscode`.
- Thông tin hai gia đình: sửa tên bố mẹ hai bên trong `<section id="family">`.
- Số tài khoản mừng cưới & mã QR: sửa trong phần `<section id="gift">` của
  `index.html`. Mỗi nút "Xem mã QR chuyển khoản" có 4 thuộc tính cần sửa đúng
  thông tin thật:
  - `data-bin`: mã ngân hàng (BIN) theo chuẩn Napas — Vietcombank `970436`,
    Techcombank `970407`, BIDV `970418`, VietinBank `970415`, MB Bank
    `970422`, ACB `970416`, Agribank `970405`, TPBank `970423`, Sacombank
    `970403`, VPBank `970432`... (tra thêm tại napas.com.vn hoặc app ngân
    hàng của bạn nếu không thấy trong danh sách này).
  - `data-account`: số tài khoản (chỉ số, không dấu cách).
  - `data-name`: tên chủ tài khoản viết KHÔNG DẤU, in hoa (đúng như trên thẻ/sổ).
  - `data-purpose`: nội dung chuyển khoản gợi ý, không dấu.

  Mã QR được **tạo trực tiếp trên trình duyệt** theo chuẩn VietQR (không gọi
  về server nào), nên khi khách bấm nút, mã sẽ tự sinh từ đúng thông tin bạn
  điền — quét được bằng hầu hết app ngân hàng và ví điện tử (MoMo, ZaloPay...)
  có hỗ trợ VietQR, tự điền sẵn số tài khoản (khách chỉ cần nhập số tiền).
  Nếu chưa chắc BIN ngân hàng của mình, cách chắc chắn nhất là vào app ngân
  hàng → tính năng "Nhận tiền/Tạo QR" để lấy đúng mã BIN, hoặc thử quét mã QR
  demo bằng app ngân hàng của bạn để kiểm tra trước khi gửi cho khách.
- Ảnh cưới: thêm ảnh vào `assets/img/`, rồi trong `index.html` phần
  `<section id="gallery">` thay các `<div class="gallery-item">` bằng
  `<img src="assets/img/ten-anh.jpg">` (có thể hỏi lại mình để mình chèn sẵn
  khi bạn gửi ảnh thật).
- Nhạc nền (không bắt buộc): thêm file `bg-music.mp3` vào `assets/audio/`.
  Nếu không có nhạc, nút nhạc vẫn hiển thị nhưng không phát — không lỗi gì.
- Màu sắc / font: mở `assets/css/style.css`, sửa các biến trong khối
  `:root { ... }` ở đầu file (ví dụ `--color-primary`).

## 3. Link thiệp riêng cho từng khách mời

Không cần server hay database — chỉ cần thêm `?to=Tên+khách` vào cuối link
website. Ví dụ:

```
https://ten-mien-cua-ban.vercel.app/?to=Nguyen%20Van%20A
```

Khi khách mở link này, trang bìa và lời chào sẽ tự hiển thị đúng tên họ.
Nếu không có `?to=`, trang sẽ hiển thị mặc định "Quý khách".

Vài mẹo thêm:
- Thêm dấu `+` ở cuối tên để mời kèm người thân, ví dụ
  `?to=Thanh+Toan+` sẽ hiển thị "Thanh Toàn và người thân".
- Có thể dùng `?name=...` thay cho `?to=...` (hai cách viết như nhau).
- Nếu muốn gắn thêm 1 mã riêng để theo dõi khách nào bấm vào link (không
  hiển thị lên thiệp), thêm `&khachmoi=MÃ_RIÊNG` vào cuối link, ví dụ
  `?to=Thanh+Toan&khachmoi=ABC123`.

**Cách tạo hàng loạt link cho cả danh sách khách mời:**

1. Mở `guests.csv` bằng Excel/Google Sheets, điền danh sách khách.
2. Copy cột "Ho ten".
3. Mở file `generate-links.html` (double-click để mở bằng trình duyệt,
   hoặc dùng ngay bản online sau khi deploy: `https://ten-mien.vercel.app/generate-links.html`).
4. Dán tên đã copy vào ô danh sách, điền đúng địa chỉ website của bạn, bấm
   "Tạo link" → bấm "Copy" từng link hoặc "Tải file CSV" để lấy toàn bộ.
5. Gửi link riêng cho từng khách qua Zalo/Messenger/SMS.

**Tạo thiệp riêng cho nhà trai / nhà gái, giờ tự chọn, tạo hàng loạt — không cần sửa code:**

Mỗi bên (nhà trai, nhà gái) chỉ có 2 mục trên thiệp: **Tiệc Chung Vui** và
một buổi lễ riêng (nhà gái: **Lễ Vu Quy**, nhà trai: **Lễ Thành Hôn**), giờ
giấc mỗi bên có thể khác nhau. Mở `generate-links.html`, trong khối
"⏰ Cài đặt ngày giờ & địa điểm":

1. Ở mục **"Tạo thiệp cho bên nào?"**, chọn 🌿 Nhà Gái hoặc 🥂 Nhà Trai —
   nhãn các ô bên dưới sẽ tự đổi tên buổi lễ cho đúng (Vu Quy / Thành Hôn),
   và giờ gợi ý cũng tự đổi theo (8:00 hoặc 9:30, có thể sửa tay).
2. Điền giờ + ngày, địa điểm, link Google Maps cho **Tiệc Chung Vui** và cho
   buổi lễ của bên vừa chọn. Vì một loạt khách thường được mời cùng giờ, bạn
   chỉ cần điền **một lần** ở đây.
3. Bấm "👀 Xem thử thiệp với thông tin này" để kiểm tra trước khi gửi.
4. Dán toàn bộ danh sách khách của bên đó vào ô danh sách phía trên, bấm
   "Tạo link" — mọi link sinh ra cho cả danh sách đều tự mang đúng giờ/địa
   điểm/tên buổi lễ vừa điền, không cần nhập lại cho từng khách.
5. Muốn tạo link cho bên còn lại: đổi lựa chọn ở mục 1, dán danh sách khách
   của bên đó, kiểm tra lại giờ rồi bấm "Tạo link" lần nữa.

Khi khách mở link, thiệp chỉ hiển thị đúng 2 mục của bên họ được mời (không
lẫn thông tin bên kia), và phần đếm ngược + ngày Âm lịch ở đầu trang cũng tự
tính theo giờ buổi lễ của đúng bên đó.

Cơ chế: thông tin này được gắn thẳng vào link dưới dạng tham số URL (`ben`,
`ngay`, `le_label`, `le_gio`, `le_diadiem`, `le_map`, `tiec_gio`,
`tiec_diadiem`, `tiec_map`), thiệp sẽ đọc và hiển thị đúng theo link mà khách
bấm vào. Nếu không cài đặt gì, thiệp hiển thị thông tin mặc định (bên Nhà
Gái) đang có trong `index.html` / `assets/js/main.js`.

## 4. Nhận phản hồi RSVP (khách xác nhận tham dự)

Bản demo hiện chỉ hiển thị lời cảm ơn sau khi bấm gửi (chưa lưu dữ liệu đi
đâu). Khi triển khai thật, bạn có 2 lựa chọn **miễn phí**, chọn 1 trong 2:

**Cách A — Dễ nhất: Google Form**
1. Tạo 1 Google Form với các câu hỏi giống form RSVP (họ tên, SĐT, tham dự,
   số người đi cùng, lời chúc).
2. Lấy link Google Form, có thể nhúng bằng `<iframe>` thay cho phần RSVP,
   hoặc đặt nút "Xác nhận tham dự" dẫn sang link đó (mở tab mới).
3. Toàn bộ phản hồi tự động về 1 Google Sheet, miễn phí, không giới hạn.

**Cách B — Giữ giao diện RSVP hiện tại, gửi dữ liệu về Google Sheet**
Dùng dịch vụ miễn phí như [SheetDB](https://sheetdb.io) hoặc
[Google Apps Script Web App](https://developers.google.com/apps-script) làm
API nhận dữ liệu, rồi sửa đoạn `fetch(...)` trong `assets/js/main.js` (mục
"RSVP form (demo)") để gửi `data` lên đó thay vì chỉ hiện lời cảm ơn. Đây là
phần kỹ thuật hơn — báo lại cho mình nếu muốn mình làm sẵn phần này.

## 5. Sổ lưu bút (lời chúc của khách)

Bản demo cho khách gõ lời chúc và thấy nó hiện ngay lên "tường lưu bút" —
nhưng vì trang không có server, lời chúc đó **chỉ hiển thị tạm trên máy của
người vừa gõ** (mất khi tải lại trang), khách khác sẽ không thấy được.

Để lời chúc lưu thật và mọi người cùng xem được (giống các trang thiệp cưới
chuyên nghiệp), dùng đúng cách B ở mục 4: nối `assets/js/main.js` (đoạn "Sổ
lưu bút") vào cùng 1 Google Sheet/API — mỗi lần có người gửi lời chúc thì
`POST` lên Sheet, đồng thời khi trang tải lên thì `GET` danh sách lời chúc
mới nhất về để hiển thị cho mọi khách đều thấy giống nhau. Đây là phần kỹ
thuật hơn, báo lại cho mình nếu muốn mình làm sẵn phần này.

## 6. Deploy miễn phí (chọn 1 trong 3 cách, đều free và có HTTPS)

### 🔹 Cách 1 — Vercel (khuyên dùng, nhanh nhất, có tên miền phụ đẹp)
1. Vào [vercel.com](https://vercel.com) → đăng ký bằng Google/GitHub (miễn phí).
2. Bấm **Add New → Project**.
3. Có 2 cách đưa code lên:
   - **Kéo thả**: bấm "Deploy" rồi kéo thả cả thư mục `wedding-invite` vào
     (Vercel hỗ trợ deploy trực tiếp không cần Git cho gói miễn phí qua
     [vercel.com/new](https://vercel.com/new) → mục "Deploy without Git").
   - **Qua GitHub** (khuyên dùng nếu bạn sẽ cập nhật nhiều lần): tạo 1
     repository trên GitHub, đẩy toàn bộ thư mục lên, rồi ở Vercel chọn
     "Import Git Repository" và chọn repo đó.
4. Vercel sẽ cấp ngay 1 địa chỉ dạng:
   `https://wedding-invite-xxxx.vercel.app` — đây là bản demo bạn xem thử.
5. Mỗi lần bạn sửa file và deploy lại, link vẫn giữ nguyên.

### 🔹 Cách 2 — Netlify
1. Vào [netlify.com](https://netlify.com) → đăng ký miễn phí.
2. Vào **Sites → Add new site → Deploy manually**.
3. Kéo thả thư mục `wedding-invite` vào khung upload.
4. Netlify cấp link dạng `https://ten-ngau-nhien.netlify.app`.
5. Vào **Site settings → Change site name** để đổi thành tên đẹp hơn, ví dụ
   `minhanh-thuytrang.netlify.app` (vẫn miễn phí).

### 🔹 Cách 3 — GitHub Pages
1. Tạo tài khoản GitHub (miễn phí), tạo 1 repository mới, ví dụ
   `wedding-invite`.
2. Upload toàn bộ nội dung thư mục này lên repository đó.
3. Vào **Settings → Pages**, chọn nhánh `main`, thư mục `/root`, bấm Save.
4. Sau 1-2 phút, trang sẽ chạy tại:
   `https://ten-tai-khoan.github.io/wedding-invite/`

## 7. Về "tên miền free" — sự thật cần biết

Không có cách nào để có **tên miền riêng thật sự miễn phí vĩnh viễn** kiểu
`minhanh-thuytrang.com` (tên miền `.com/.vn` luôn phải trả phí đăng ký hàng
năm, khoảng 150.000–350.000đ/năm cho `.com`, hoặc cao hơn cho `.vn`).
Tuy nhiên có các lựa chọn tốt và **miễn phí hoàn toàn**:

- **Dùng subdomain miễn phí có sẵn** của Vercel/Netlify/GitHub Pages như trên
  — chọn được tên tuỳ ý (ví dụ `minhanh-thuytrang.vercel.app`), không tốn phí,
  vẫn có HTTPS, chạy nhanh, đủ đẹp để gửi khách mời. → **Khuyên dùng cho đám
  cưới vì chỉ cần dùng vài tháng.**
- **Nếu muốn tên miền riêng ngắn gọn** (ví dụ `minhanhtrang.com`), bạn có thể
  mua với giá rẻ (~150–300k/năm) ở Namecheap, Nhân Hoà, hoặc PA Vietnam, rồi
  vào phần **Domains** của Vercel/Netlify để trỏ tên miền đó vào trang đã
  deploy — các nền tảng này tự cấp HTTPS miễn phí, bạn chỉ trả tiền tên miền.
- Có một số dịch vụ tên miền miễn phí như Freenom (`.tk`, `.ml`...) nhưng
  hiện **không còn ổn định/đáng tin cậy** (dễ bị thu hồi tên miền đột ngột),
  nên mình không khuyến khích dùng cho thiệp cưới.

## 8. Sau khi xem demo

Bạn cứ xem thử bản demo, rồi báo lại các điểm muốn chỉnh sửa, ví dụ:
- Ảnh cưới thật, tên, ngày giờ, địa điểm chính xác
- Đổi tông màu / font chữ
- Thêm/bớt mục (ví dụ: thêm phần "Cô dâu chú rể" giới thiệu riêng, thêm bản
  đồ chỉ đường chi tiết, đổi bố cục timeline...)
- Kết nối RSVP thật vào Google Sheet

Mình sẽ cập nhật trực tiếp theo yêu cầu.
