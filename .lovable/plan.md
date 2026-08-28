# Accessibility Audit & Fixes — AnFund

## Kết quả audit

Điểm tốt hiện có: `lang="vi"`, đúng 1 `<main>` mỗi trang, ảnh trang trí đã có `alt=""` + `aria-hidden`, nút icon-only ở Header (menu mobile) và DemoLayout (nút quay về) đã có `aria-label`, badge trạng thái/rủi ro đều có chữ (không dựa vào màu đơn thuần), form đăng ký ở trang chủ đã gắn label đúng.

### Critical (chặn người dùng)

1. **Duplicate `id="how-it-works"`** — cả `ProcessSection.tsx` (dòng 42) và `FeaturesSection.tsx` (dòng 76) cùng dùng id này. `FeaturesSection` còn chứa các feature card có `id="borrower"`, `id="lender"`, `id="auction"` trong data (dùng làm React key, không phải DOM id — OK). Hai DOM id trùng nhau làm hỏng anchor navigation và ARIA reference.
   - Sửa: đổi id của `FeaturesSection` thành `id="features"`, giữ `#how-it-works` cho `ProcessSection` (nav đang trỏ tới).

2. **Input trong form demo không có label liên kết** — `Label`/`FieldLabel` trong `demo/BorrowerView.tsx` và `demo/LenderView.tsx` là `<div>`, không gắn với input:
   - `NumberField` (Số tiền vay, Kỳ hạn, Thu nhập), input "Thời gian phiên đấu giá" (BorrowerView)
   - `Lịch sử tài chính`, `Tài sản bảo đảm` (BorrowerView)
   - Tất cả field trong `NewOfferForm`: Tên đơn vị, Lãi suất, Số tiền tài trợ, Kỳ hạn, Điều kiện giải ngân, Yêu cầu bảo đảm (LenderView)
   - Ô tìm kiếm hồ sơ (LenderView) chỉ có placeholder
   - Screen reader không đọc được tên field; click label không focus input.
   - Sửa: đưa `Label`/`FieldLabel` thành `<label htmlFor>` thật + gán `id` cho input (dùng `useId`), hoặc thêm `aria-label` cho ô tìm kiếm.

### Warning (giảm trải nghiệm)

3. **Nhóm nút chọn một-trong-nhiều thiếu trạng thái ARIA** — các nhóm pill/radio-style: chọn mục đích vay, thời gian phiên, mức rủi ro (BorrowerView), bộ lọc rủi ro (LenderView), chọn vai trò (SignupSection), và tab switcher 3 vai trò (DemoLayout). Người dùng screen reader không biết nút nào đang được chọn.
   - Sửa: thêm `aria-pressed={active}` (đơn giản nhất, không đổi markup).

4. **`min-h-screen` thay vì `min-h-dvh`** — `DemoLayout.tsx` dòng 33. Trên mobile Safari/Chrome, `100vh` tính cả thanh URL → layout bị tràn.
   - Sửa: đổi thành `min-h-dvh`.

5. **Tap target nút menu mobile 40×40** — `Header.tsx` nút hamburger `h-10 w-10`, dưới mức 44×44 khuyến nghị.
   - Sửa: tăng lên `h-11 w-11`.

### Info (best practice)

6. **Biểu đồ cột chỉ đọc được bằng mắt** — `RateDistribution` (AuctionView) và chart trong `MockupsSection` dùng `div` + `title` (chỉ hover). Thêm `role="img"` + `aria-label` tóm tắt ("3 đề xuất ở khoảng 7,0–7,5%, tốt nhất 7,2%").
7. **Thanh tiến trình phiên đấu giá** (AuctionView) thiếu `role="progressbar"` + `aria-valuenow/min/max`.
8. **Đồng hồ đếm ngược** cập nhật mỗi giây — thêm `aria-hidden` cho phần số nhấp nháy và một `sr-only` text tĩnh ("Còn khoảng 6 giờ") để tránh screen reader đọc liên tục.
9. **Thiếu link "Bỏ qua điều hướng" (skip-to-content)** ở đầu trang chủ — thêm skip link ẩn, hiện khi focus, trỏ tới `#top`.
10. **Nhóm heading trong demo**: `AuctionView` dùng `h4` mà không có `h2/h3` phía trên — chỉnh về `h2`/`h3` cho đúng thứ bậc.

## Thứ tự thực hiện

1. Critical #1 (duplicate id) — 1 dòng.
2. Critical #2 (form labels demo) — BorrowerView + LenderView.
3. Warning #3 (aria-pressed các nhóm nút chọn).
4. Warning #4, #5 (min-h-dvh, tap target).
5. Info #6–#10 (role/aria cho chart, progressbar, countdown, skip link, heading demo).

## Chi tiết kỹ thuật

- Không đổi màu sắc, layout, hay nội dung — chỉ thêm/sửa thuộc tính ARIA, label, id.
- File sửa: `src/components/FeaturesSection.tsx`, `src/components/demo/BorrowerView.tsx`, `src/components/demo/LenderView.tsx`, `src/components/demo/AuctionView.tsx`, `src/components/demo/DemoLayout.tsx`, `src/components/Header.tsx`, `src/components/SignupSection.tsx`, `src/components/MockupsSection.tsx`, `src/routes/index.tsx`.
- Verify sau sửa: chạy lại Playwright, kiểm tra không còn duplicate id, mọi input có accessible name (`getByLabel` query thử nghiệm), build OK.
