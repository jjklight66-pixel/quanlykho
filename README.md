# Northstar WMS

Hệ thống quản lý kho (WMS) và đơn hàng (OMS), chạy trên máy cá nhân. Dự án gồm PostgreSQL, API Express, trang quản trị React và ứng dụng kho dùng Expo.

## Chạy toàn bộ dự án

Yêu cầu: Node.js 20 trở lên, npm 10 trở lên và Docker Desktop đang chạy.

Mở terminal tại thư mục dự án rồi chạy:

```powershell
npm start
```

Lệnh `npm start` cài các gói cần thiết, khởi động PostgreSQL, tạo cấu trúc cơ sở dữ liệu, nạp dữ liệu mẫu rồi chạy API, trang web quản trị và ứng dụng Expo. Mở web tại http://localhost:5173. API kiểm tra trạng thái ở http://localhost:4000/api/health. Terminal sẽ hiển thị mã QR để mở ứng dụng điện thoại bằng Expo Go.

API có giá trị bí mật mặc định dành cho phát triển cục bộ. Trước khi chia sẻ hoặc triển khai, hãy đặt `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET` trong tệp `.env`.

### Kết nối điện thoại thật

Điện thoại và máy tính cần dùng chung mạng. Ứng dụng điện thoại phải gọi API bằng địa chỉ IP LAN của máy tính, ví dụ `http://192.168.1.25:4000/api`; địa chỉ `localhost` trên điện thoại sẽ trỏ về chính điện thoại. Lệnh khởi động ứng dụng di động tự tìm IP LAN. Expo Go hỗ trợ quét mã bằng camera trên thiết bị. Android Emulator thường truy cập máy chủ qua `http://10.0.2.2:4000/api`.

## Tài khoản dùng thử

Các tài khoản được tạo từ dữ liệu mẫu đều dùng mật khẩu `WmsDemo!2026`:

| Vai trò | Email |
|---|---|
| Quản trị viên | `admin@wms.local` |
| Nhân viên kho | `warehouse@wms.local` |
| Nhân viên giao hàng | `shipper@wms.local` |

Dữ liệu mẫu tạo hai kho, 60 sản phẩm/SKU, tồn kho ở cả hai kho và một đơn bán hàng `SO-DEMO-001`. Có thể chạy lại seed mà không tạo trùng danh mục hoặc số lượng tồn.

## Cấu trúc dự án

```text
apps/
  api/       API Express, cấu trúc cơ sở dữ liệu, migration và dữ liệu mẫu
  web/       Trang quản trị React/Vite
  mobile/    Ứng dụng Expo để quét mã, lấy hàng và giao hàng
packages/   Các gói dùng chung
scripts/    Script hỗ trợ chạy API khi phát triển
```

## Chức năng hiện có

- Đăng nhập bằng JWT, làm mới token luân phiên được lưu dưới dạng băm, kiểm tra vai trò và quyền theo kho.
- Tìm kiếm tồn kho; phân bổ đơn theo FEFO với khóa dòng PostgreSQL; giữ chỗ idempotent; lấy/đóng gói hàng và trừ tồn; nhận hàng; giao hàng; tạo kiểm kê; quản lý người dùng; ghi sổ giao dịch kho chỉ nối thêm.
- Trang tổng quan quản trị, cảnh báo sắp hết hàng, tìm kiếm/xuất dữ liệu tồn kho, đơn bán hàng, nhận hàng, xử lý giao hàng, nhật ký kiểm toán và quản lý quyền nhóm.
- Ứng dụng di động hỗ trợ đăng nhập với SecureStore, quét mã vạch/QR bằng camera, xác nhận lấy hàng và giao hàng, lưu hàng đợi thao tác khi ngoại tuyến.

## Giới hạn hiện tại

Một số phần cần hoàn thiện trước khi dùng trong môi trường sản xuất: tự làm mới phiên đăng nhập trên ứng dụng di động, khôi phục tài khoản/MFA, giao diện kiểm kê đầy đủ, đối soát chi tiết phiếu nhận với đơn mua, lưu ảnh bằng chứng giao hàng, cập nhật thời gian thực qua socket, đồng bộ ngoại tuyến an toàn có idempotency phía máy chủ, kiểm thử tự động, giám sát, sao lưu và quản lý bí mật sản xuất.

API đã có các endpoint tạo/ghi nhận/duyệt kiểm kê, nhưng web và ứng dụng di động chưa có quy trình kiểm kê hoàn chỉnh. Trường bằng chứng giao hàng trên ứng dụng di động hiện chỉ lưu thông tin mô tả, chưa tải ảnh lên máy chủ.

## Tài liệu dự án

- [Báo cáo dự án](BAO_CAO_DU_AN.md)
- [Hướng dẫn cài đặt và sử dụng](HUONG_DAN_SU_DUNG.md)
