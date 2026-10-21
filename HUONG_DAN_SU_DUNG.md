# HƯỚNG DẪN CHẠY VÀ SỬ DỤNG NORTHSTAR WMS

**Phiên bản:** 1.0 · **Cập nhật:** 21/10/2026

Tài liệu này hướng dẫn cài môi trường phát triển, chạy web/API/mobile, đăng nhập demo và thao tác các nghiệp vụ chính. Northstar WMS hiện là project phát triển/trình diễn cục bộ, chưa phải dịch vụ production.

## 1. Yêu cầu môi trường

- Windows, macOS hoặc Linux có thể chạy Node.js và Docker.
- Node.js 20 trở lên; npm 10 trở lên.
- Docker Desktop đang chạy để khởi động PostgreSQL.
- Điện thoại và máy tính cùng mạng Wi-Fi/LAN để thử ứng dụng Expo trên thiết bị thật.
- Cài **Expo Go** trên điện thoại nếu muốn mở ứng dụng mobile trong giai đoạn phát triển.

## 2. Cài đặt lần đầu

Mở terminal tại thư mục gốc repository (thư mục chứa `package.json`) và chạy:

```bash
npm start
```

Lệnh này gọi lần lượt quy trình setup rồi khởi chạy các dịch vụ:

1. Cài dependency của npm workspaces.
2. Khởi động PostgreSQL bằng Docker Compose.
3. Áp dụng schema cơ sở dữ liệu.
4. Tạo dữ liệu demo: tài khoản, hai kho, sản phẩm/SKU, tồn ban đầu và đơn mẫu.
5. Chạy API, web và Expo đồng thời trong cùng cửa sổ terminal.

Để dừng các tiến trình phát triển, nhấn **Ctrl + C** trong terminal. Docker PostgreSQL vẫn giữ dữ liệu trong volume `wms_pgdata`; dừng server không tự xóa dữ liệu.

### Các lần chạy tiếp theo

Nếu dependency và dữ liệu đã khởi tạo, chạy:

```bash
npm run dev:all
```

Lệnh này chạy API, web và mobile trong **một terminal**. Nếu chỉ làm việc với web và API, dùng:

```bash
npm run dev
```

Nếu cần mở riêng Expo trong lúc API đã chạy:

```bash
npm run mobile
```

Không cần mở một CMD cho `npm start` và CMD thứ hai cho `npm run dev:all`: `npm start` đã tự chạy setup và sau đó chạy `dev:all`.

## 3. Địa chỉ truy cập và dịch vụ

| Thành phần | Địa chỉ mặc định |
|---|---|
| Web | http://localhost:5173 |
| API health | http://localhost:4000/api/health |
| PostgreSQL | `localhost:5432` |
| Expo Metro | thường là cổng `8081`; terminal in QR mở trong Expo Go |

Nếu API health trả JSON có trạng thái `ok`, API kết nối được cơ sở dữ liệu. Web hoặc mobile báo `Failed to fetch` thì kiểm tra Docker, API và địa chỉ máy chủ.

## 4. Tài khoản demo

Seed tạo sẵn các tài khoản sau; cả ba dùng mật khẩu demo `WmsDemo!2026`:

| Vai trò | Email |
|---|---|
| Quản trị | `admin@wms.local` |
| Nhân viên kho | `warehouse@wms.local` |
| Nhân viên giao hàng | `shipper@wms.local` |

Dùng tài khoản quản trị để thêm người dùng, sửa vai trò/kho được cấp và đặt lại mật khẩu. Tài khoản demo chỉ để thử nghiệm. Nếu đưa project lên môi trường dùng chung, đổi mật khẩu và secrets trước.

## 5. Sử dụng web

Truy cập http://localhost:5173 rồi đăng nhập. Các mục chính nằm ở thanh bên.

### 5.1 Xem tổng quan và tồn kho

1. Mở **Tổng quan** để xem KPI, cảnh báo tồn thấp và hoạt động đơn.
2. Chọn kho trong danh sách kho ở thanh trên nếu tài khoản được cấp nhiều kho.
3. Mở **Tồn kho**, tìm theo SKU/tên sản phẩm/mã vạch để xem số lượng theo lô và vị trí.
4. Sau thao tác ở điện thoại, bấm **Làm mới** trên trang liên quan hoặc tải lại web để lấy dữ liệu mới.

### 5.2 Thử nhập kho

1. Vào **Nhập kho**.
2. Chọn sản phẩm/SKU trong danh mục.
3. Nhập số lượng nhận, lô hàng, hạn sử dụng và vị trí xếp hàng hợp lệ của kho đang chọn.
4. Bấm **Xác nhận đã nhận**.
5. Mở **Tồn kho** hoặc **Tổng quan** và làm mới; số lượng phải tăng. Có thể kiểm tra giao dịch tại **Nhật ký kho**.

Ghi chú: vị trí phải thuộc kho đang nhận hàng. Một SKU/lô/vị trí hiện có thể được cộng dồn vào dòng tồn tương ứng.

### 5.3 Thử tạo và xuất một đơn

1. Mở **Xuất kho** (mục hiển thị tên “Xuất kho”; URL là `/orders`).
2. Chọn **Tạo phiếu xuất**; nhập mã đơn, tên người nhận, số điện thoại/địa chỉ nếu có, SKU và số lượng.
3. Bấm **Tạo đơn xuất**.
4. Ở dòng đơn, bấm **Cấp phát** để giữ tồn khả dụng.
5. Bấm **Xác nhận lấy hàng / xuất** để xác nhận lấy hàng và trừ tồn.
6. Khi trạng thái là **Đã đóng gói**, bấm **In phiếu xuất / PDF**. Trong hộp thoại in, chọn máy in hoặc **Lưu thành PDF**.

Phiếu in bao gồm mã đơn, ngày, trạng thái, kho, hàng hóa, thông tin người nhận và người xuất. Người xuất lấy từ tài khoản đã đăng nhập tại thời điểm tạo phiếu. QR trên chứng từ dùng để ứng dụng mobile tra cứu phiếu.

### 5.4 Cập nhật hồ sơ tài khoản

- Mở **Tài khoản của tôi** ở thanh bên.
- Cập nhật họ tên, email và số điện thoại rồi bấm **Lưu thông tin**.
- Vai trò và kho được cấp chỉ xem được; nhờ quản trị viên thay đổi tại **Nhân sự & quyền truy cập**.
- Hãy điền số điện thoại trước khi tạo phiếu nếu muốn số đó xuất hiện trong chứng từ.

### 5.5 Quản lý tài khoản (quản trị viên)

1. Mở **Nhân sự & quyền truy cập**.
2. Bấm **Thêm tài khoản**, điền email, họ tên, số điện thoại, mật khẩu tạm, vai trò và kho được phép.
3. Dùng **Sửa quyền** để cập nhật thông tin/khóa tài khoản; dùng **Đặt lại mật khẩu** khi cần.
4. Người dùng đăng nhập bằng email và mật khẩu tạm; nếu mất mật khẩu, quản trị viên có thể đặt lại trong trang này.

### 5.6 Giao hàng và nhật ký

- Trong **Giao hàng**, làm mới danh sách; đơn xuất hiện sau khi được đóng gói. Chọn bắt đầu giao rồi xác nhận đã giao.
- Trong **Nhật ký kho**, xem các biến động số lượng và số dư sau giao dịch.

## 6. Sử dụng ứng dụng điện thoại

### 6.1 Mở Expo Go

1. Đảm bảo `npm run dev:all` hoặc `npm run mobile` đang chạy và terminal đã hiện QR Expo.
2. Điện thoại cùng mạng LAN/Wi-Fi với máy tính.
3. Mở ứng dụng **Camera** trên iPhone hoặc Expo Go/camera phù hợp trên Android và quét QR terminal.
4. Chọn mở bằng Expo Go. Khi được hỏi, cấp quyền camera cho chức năng quét.
5. Đăng nhập bằng tài khoản demo; nhân viên kho thường dùng `warehouse@wms.local`.

Nếu điện thoại không kết nối được API, không dùng `localhost` làm API trên điện thoại: `localhost` lúc này chỉ chính điện thoại. Script Expo tự dò IP LAN của máy tính. Nếu dò sai, đặt biến môi trường trước khi chạy:

**PowerShell:**

```powershell
$env:EXPO_PUBLIC_API_URL="http://192.168.1.25:4000/api"
npm run dev:all
```

Thay `192.168.1.25` bằng IPv4 LAN của máy tính. Cho phép Node.js/Docker qua Windows Firewall trên mạng riêng nếu được hỏi.

### 6.2 Các tab trên mobile

- **Lấy hàng:** xem đơn phù hợp; cấp phát/giữ hàng và xác nhận lấy hàng/đóng gói. Tồn được trừ sau khi xác nhận đóng gói thành công.
- **Quét mã:** bấm mở máy quét, hướng camera vào mã. Mã sản phẩm tra cứu tồn/vị trí trong danh sách đã tải; QR phiếu xuất mở thông tin phiếu trong ứng dụng.
- **Giao hàng:** đơn đã đóng gói/đang giao; xác nhận bắt đầu và hoàn thành giao.
- Nút đồng bộ thử gửi hàng đợi giao hàng và tải lại đơn/tồn.
- **Đăng xuất:** bấm biểu tượng đăng xuất trên thanh trên cùng.

Ứng dụng hiện tập trung vào lấy hàng, quét mã và giao hàng. Nhập kho/danh mục/quản trị tài khoản là nghiệp vụ web; không phải mọi chức năng web đều có trên điện thoại.

### 6.3 Kiểm tra dữ liệu web-mobile

1. Đăng nhập web và điện thoại vào cùng môi trường API/cơ sở dữ liệu.
2. Trên web, nhập một lượng nhỏ cho SKU test vào kho được cấp.
3. Trên điện thoại, mở **Quét mã** và quét mã SKU đó để tra cứu; hoặc xử lý một đơn xuất đủ điều kiện.
4. Trên web, mở **Tồn kho**, **Giao hàng** hoặc **Nhật ký kho** tương ứng rồi làm mới.

Web và mobile dùng cùng dữ liệu trên server. Thay đổi xuất hiện sau khi thao tác API thành công và phía còn lại tải dữ liệu mới; hiện chưa có cập nhật đẩy tức thời bằng WebSocket.

## 7. Cấu hình môi trường

Tệp `.env.example` liệt kê cấu hình API cơ bản. Khi cần cấu hình riêng:

1. Sao chép `.env.example` thành `.env` tại thư mục gốc.
2. Đặt `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PORT` và `WEB_ORIGIN` phù hợp.
3. `.env` đã nằm trong `.gitignore`; không đưa secrets lên GitHub.

Mặc định phát triển sử dụng database `wms`, user `wms`, cổng `5432`; Docker Compose có mật khẩu dev mẫu. Không giữ mặc định này khi triển khai chia sẻ/production.

## 8. Khắc phục lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `Failed to fetch` trên web | Kiểm tra `npm start`/`npm run dev:all`; mở `http://localhost:4000/api/health`; kiểm tra PostgreSQL đang chạy. |
| `EADDRINUSE` hoặc port 4000 đã được dùng | Có thể API cũ đang chạy. Tránh khởi động API thứ hai; đóng terminal cũ hoặc để script dev dùng API đang hoạt động. |
| Expo QR không quét/mở được | Cập nhật Expo Go, đảm bảo Metro đã sẵn sàng và hai thiết bị cùng mạng; quét QR Expo Go, không nhầm với QR mã hàng/chứng từ. |
| App mobile báo không kết nối | Dùng IP LAN của máy tính trong `EXPO_PUBLIC_API_URL`; kiểm tra firewall và mạng Wi-Fi. |
| Camera không mở | Cấp quyền camera cho Expo Go trong cài đặt điện thoại, sau đó mở lại máy quét. |
| Phiếu nhập báo vị trí không hợp lệ | Chọn một vị trí/bin thuộc đúng kho đang chọn; không gõ mã vị trí tùy ý nếu danh sách yêu cầu chọn bin hợp lệ. |
| Trang web trắng sau cập nhật | Tải lại mạnh bằng **Ctrl + F5**; nếu vẫn lỗi, xem lỗi đầu tiên trong DevTools → Console. |
| Muốn giữ data nhưng dừng PostgreSQL | Dừng tiến trình app; dữ liệu nằm trong volume Docker. Không dùng lệnh xóa volume nếu muốn bảo toàn dữ liệu. |

## 9. Lệnh hữu ích

```bash
npm start                          # Setup lần đầu rồi chạy toàn bộ stack
npm run dev:all                    # Chạy API + web + Expo
npm run dev                        # Chạy API + web
npm run mobile                     # Chạy riêng Expo (API phải chạy sẵn)
npm run db:up                      # Bật PostgreSQL
npm run db:down                    # Dừng PostgreSQL, giữ volume dữ liệu
npm run db:migrate                 # Áp dụng schema
npm run db:seed                    # Tạo/cập nhật dữ liệu demo
npm run build --workspace=@wms/web # Build web production
```

## 10. Giới hạn cần nhớ

- Đây là môi trường dev/demo; không dùng dữ liệu cá nhân hoặc dữ liệu kho thật quan trọng trước khi có backup/bảo mật phù hợp.
- Dashboard web tự làm mới định kỳ; các màn hình khác thường cần làm mới hoặc tải lại sau thao tác từ máy khác.
- Hàng đợi offline trên mobile chỉ hỗ trợ hẹp một số thao tác giao hàng; không coi là chế độ offline toàn diện.
- QR chứng từ là mã định danh để tra cứu đơn trong app; nó không phải QR thanh toán hay chữ ký số.
- Tài khoản seed và mật khẩu hiển thị trong repository chỉ để trình diễn.
