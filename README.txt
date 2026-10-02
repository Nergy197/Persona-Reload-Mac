PERSONA RELOAD — MAC DESKTOP
Menu ứng dụng lấy cảm hứng từ Persona 3 Reload. Bản sửa 2.

BẮT ĐẦU
1. Mở Preview.html trong Safari hoặc Chrome để thử animation ngay.
   Animation-preview.gif là bản xem nhanh chuyển động của bản sửa 2.
   Đây là bản xem thử: bấm nút chỉ thông báo, không mở ứng dụng.
2. Tải Übersicht từ https://tracesof.net/uebersicht/ và cài vào Applications.
3. Mở Übersicht. Chọn “Open Widgets Folder” từ biểu tượng trên menu bar.
4. Chép cả thư mục Persona-Reload.widget vào thư mục vừa mở.
   Giữ nguyên tên thư mục. Không chép cả thư mục Persona-Reload-Mac.
5. Trong Preferences/Settings của Übersicht, bật Interaction và cấu hình
   phím tương tác nếu phiên bản của bạn yêu cầu. Cấp quyền Accessibility cho
   Übersicht trong System Settings > Privacy & Security > Accessibility.
   Menu chỉ nhận hover/click khi Übersicht cho phép tương tác.
6. Chọn “Refresh All Widgets”. Góc dưới trái phải hiện “DESKTOP / READY”.
   Nếu vẫn hiện PREVIEW, cầu nối chưa được nạp; hãy thoát/mở lại Übersicht.

CÁCH DÙNG
- Rê chuột: con trỏ tam giác trắng/hồng di chuyển giữa các mục; chữ phía trên
  nhường chỗ; phần chữ bị con trỏ quét qua đổi đỏ. Các dòng nghiêng độc lập.
- Bấm: gửi yêu cầu mở app trên Mac.
- Phím lên/xuống: chuyển mục; Enter: mở; Escape: đóng thông báo.
- Nếu phím không hoạt động, bấm vào menu trước để lấy focus.
- Ngày/giờ là giờ cục bộ của máy, cập nhật mỗi 30 giây.
- Khi bật Reduce Motion của hệ thống, chuyển động được giảm/tắt.
- Animation nền chỉ chạy khi không có cửa sổ app nào trên desktop (kiểm tra mỗi
  giây bằng src/desktop-covered, build từ desktop-covered.c). Có cửa sổ thì dừng.
- Không có nhạc nền hoặc âm thanh.

APP MẶC ĐỊNH
ANTIGRAVITY  Antigravity
ARC          Arc
FINDER       Finder
NOTES        Notes
DISCORD      Discord
MUSIC        Apple Music
CALENDAR     Calendar
SETTINGS     System Settings

CHỈNH SỬA
- Đổi tên hiển thị hoặc thứ tự tại Persona-Reload.widget/src/config.js.
- Muốn đổi sang app khác: sửa bundle trong config.js (bundle identifier,
  xem bằng: mdls -name kMDItemCFBundleIdentifier /Applications/Tên.app).
  Chỉ đổi label sẽ đổi chữ, không đổi app đích.
- Nền động gồm 2 lớp tách từ background.png: water.png (nước, không có nhân
  vật), character.png (thân, nền trong suốt), hair.png (đuôi tóc) và
  ribbon.png (ruy băng). Nhân vật "thở" và lắc lư (style.css); tóc và ruy
  băng uốn theo nước (ripple.js: amp = biên độ, w = tốc độ); nước trôi, tia
  sáng, bọt nước.
- Đổi ảnh nền: thay water.png bằng ảnh khác và xóa character.png, hair.png, ribbon.png (hoặc thay
  bằng PNG nhân vật trong suốt cùng kích thước). Preview.html không tự cập nhật.
- Chỉnh animation trong menu.js: bộ nội suy con trỏ, góc nghiêng từng hàng,
  độ phóng 1.42 và dịch các hàng phía trên. Đây là mô phỏng, không khớp từng
  frame với game gốc.
- Font đóng gói: Archivo Black (SIL OFL, xem ArchivoBlack-OFL.txt), nén ngang
  và nghiêng theo bố cục tham chiếu. KHÔNG khẳng định đây là font gốc của game.
- Nếu máy đã có Rodin Pro UB, CSS ưu tiên dùng font đó. Có thể nhấn F rồi
  chọn tệp font OTF/TTF/WOFF của bạn để thử. Font không được tải lên mạng;
  lựa chọn qua F chỉ áp dụng cho phiên mở hiện tại.

LƯU Ý SỬ DỤNG
- Đây là widget toàn màn hình phía desktop, không thay thế Finder hoặc Dock.
  Khi tương tác đang bật, lớp widget có thể nhận click thay cho icon desktop.
- Nếu không nhận chuột: kiểm tra Interaction, Accessibility, phím tương tác,
  và tùy chọn “Send to Background” của widget nếu phiên bản đó có.
- Chưa được chạy trực tiếp trên MacBook của bạn. Phiên bản macOS và Übersicht
  có thể ảnh hưởng quyền tương tác. Nếu lỗi, gửi ảnh màn hình và bản macOS.
- Chữ và các thanh chọn được vẽ bằng HTML/CSS nên sắc nét trên Retina.
  Nền minh họa tái tạo bằng AI có kích thước 1560 × 1008, không phải ảnh gốc 4K.
- Gỡ bỏ bằng cách chuyển Persona-Reload.widget ra khỏi Widgets Folder.

NGUỒN / KỸ THUẬT
Tham khảo bố cục: ảnh mẫu Persona 3 Reload do người dùng cung cấp.
Trang game: https://persona.atlus.com/p3r/
Tài liệu widget: https://github.com/felixhageloh/uebersicht
Nền được tái tạo bằng công cụ ImageGen tích hợp, không phải asset trích xuất
từ game. Đây là bản tùy biến cá nhân không chính thức.

Prompt nền: “Preserve the upside-down blue-haired anime protagonist on the
left and underwater blue scene of the supplied screenshot. Remove all text,
HUD and portraits. Keep character in left 35%, center/right 65% clean ocean
for a programmable menu. Crisp flat anime graphic art; no UI; landscape.”

THAM KHẢO BẢN SỬA
https://adrian-kowalik.com/projects/persona-3-reload-ui-recreation
https://www.deltea.space/blog/p3r-pause-menu
Đã kiểm tra render và tương tác bằng Chromium; việc mở app qua Übersicht
vẫn cần kiểm chứng trên Mac thật.
