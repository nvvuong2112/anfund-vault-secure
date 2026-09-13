# design/ — canvas thiết kế mobile

Nguồn của bản thiết kế AnFund trên điện thoại. **Không phải mã chạy** — không có gì trong thư mục này được `src/` import, và nó không tham gia build.

## Có gì ở đây

| Tệp                   | Là gì                                                     |
| --------------------- | --------------------------------------------------------- |
| `Main.dc.html`        | Luồng người vay, 5 bước, bấm thử được                     |
| `NguoiChoVay.dc.html` | Màn hình chính của bên cho vay                            |
| `NguyenTac.dc.html`   | Bảng lập luận: sáu quyết định thiết kế kèm lý do          |
| `canvas.json`         | Vị trí các bảng vẽ trên canvas, ghi chú dán, khung mở đầu |
| `anfund-mobile.html`  | **Bản dựng — nằm trong `.gitignore`.** Xem mục dưới       |

## Hai cái bẫy

**`.dc.html` không phải HTML thường.** Nó là định dạng khuôn mẫu của Claude Design: `{{ hole }}` chỉ nhận đường dẫn có dấu chấm (`{{ a.b }}`), **không nhận biểu thức** — `{{ a + b }}` hay `{{ f() }}` hỏng trong im lặng. Giá trị đến từ `renderVals()` trong khối `<script data-dc-script>` ở cuối tệp.

**Đừng để prettier chạm vào.** Cả ba tệp đã nằm trong `.prettierignore`. Dòng `<script src="./support.js"></script>` phải giữ nguyên từng ký tự, và thuộc tính `data-props` có quy tắc thoát dấu riêng — prettier format vào là hỏng cả hai.

## Sửa rồi dựng lại

Sửa thẳng tệp `.dc.html`, rồi dựng lại bản mới bằng skill `/design` của Claude Code. Không sửa tay `anfund-mobile.html`: nó là bản đã gói sẵn cả trình chỉnh sửa (2,5 MB), mỗi lần dựng là sinh ra mới hoàn toàn.

Bản đã đăng cũng lấy ngược nguồn ra được, nên mất thư mục này không phải là mất trắng — chỉ tốn thêm một bước.

## Số liệu ở đâu ra

Màu lấy từ `src/styles.css` (navy `oklch(0.304 0.096 258)`, teal `oklch(0.578 0.097 196.6)` — chính là token bị đặt nhầm tên `--emerald`, gold `oklch(0.803 0.152 79.6)`). Hồ sơ mẫu `HS-002389` và bốn đề xuất lấy từ `src/components/demo/seed.ts`. Hai quy tắc cứng 8 giờ / 5 ngày lấy từ `src/components/demo/types.ts`.

Sửa những chỗ đó trong `src/` thì nhớ bản thiết kế **không tự cập nhật theo** — phải sửa tay ở đây.
