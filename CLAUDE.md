# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lệnh thường dùng

`bun` là công cụ quản lý gói chính thức (`bunfig.toml` + `bun.lockb`). Không tạo lại `package-lock.json` — nó đã bị xoá và nằm trong `.gitignore`.

```bash
bun install          # cài phụ thuộc
npm run dev          # dev server tại http://localhost:8080
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run format       # prettier --write .
npm run build        # build production
npm run preview      # chạy thử bản build
```

**Repo không có test.** Không có vitest/jest/playwright trong `devDependencies`, không có `.github/`. Cách kiểm chứng thay đổi là **chạy thật trong trình duyệt** — xem mục "Kiểm chứng" bên dưới.

Cả `typecheck` và `lint` hiện đều **sạch 0 lỗi**; hãy giữ nguyên như vậy. `lint` còn 17 cảnh báo `react-refresh` cố ý bỏ qua (chỉ ảnh hưởng hot-reload).

## Kiến trúc

TanStack Start (SSR đầy đủ) + React 19 + Vite 7, Tailwind v4, triển khai lên **Vercel**.

```
src/routes/__root.tsx   → toàn bộ tài liệu HTML (shellComponent), <html lang="vi">, mọi thẻ meta/OG
src/routes/index.tsx    → "/"      14 section marketing, import tĩnh
src/routes/demo.tsx     → "/demo"  DemoApp, 100% state phía client
```

Chỉ **hai route**, không lazy-load ở đâu. `src/router.tsx` không đặt gì vào router context; `__root.tsx` **không mount provider nào** (không QueryClient, không Toaster, không theme provider) — đó là chỗ để thêm nếu cần.

`src/routeTree.gen.ts` là **tệp sinh tự động**. Plugin router ghi đè nó mỗi lần chạy `dev`/`build`, thường chỉ đổi thứ tự route. Đừng sửa tay, và nếu nó bẩn sau khi chạy build thì `git restore` là đúng.

### Nơi logic thật nằm

`src/components/demo/` (~2.600 dòng) là phần ứng dụng thực sự. Các section marketing chỉ là nội dung tĩnh.

- **`types.ts`** — mô hình miền, đọc cái này trước. Chỉ 6 kiểu, không enum. Hai hằng số nghiệp vụ duy nhất của dự án nằm cuối tệp: `MIN_AUCTION_HOURS = 8`, `VERIFICATION_DAYS = 5`.
- **`store.tsx`** — React Context + `useState` (không phải `useReducer`). **Không lưu trữ, không gọi mạng** — refresh trang là mất sạch. Đồng hồ 1 Hz ở dòng 36-39 đẩy `now` xuống toàn bộ cây.
- **`seed.ts`** — 3 khoản vay mẫu, 7 đề xuất, 9 bên cho vay giả. `generateAutoOffer` mô phỏng đối thủ cạnh tranh.
- **`shared.tsx`** — mọi formatter (`formatVND`, `formatRate`, `formatCountdown`) và badge.

### Cơ chế đấu giá — không có "engine"

Toàn bộ cơ chế là: `auctionEndsAt` + đồng hồ 1 Hz cho vòng đời phiên, **sắp xếp tăng dần theo `rate`, thấp nhất thắng**, và **người vay chọn thủ công** (`acceptOffer`). Hết giờ mà không ai chọn thì phiên chỉ chuyển sang `closed`, không tự trao giải.

Phép sắp xếp đó được **viết lại ở 5 chỗ**: `BorrowerView.tsx:524`, `AuctionView.tsx:80`, `LenderView.tsx:283`, cộng hai biến thể `Math.min` ở `LenderView.tsx:118` và `:221`. Sửa cách xếp hạng là phải sửa cả năm.

**Lệch giữa lời quảng cáo và mã:** `FeaturesSection.tsx:65-66` hứa xếp hạng đa yếu tố (lãi suất, kỳ hạn, điều kiện, uy tín, độ phù hợp), nhưng mã chỉ sắp theo `rate`. `fitScore` hiển thị rất nổi bật nhưng **không hề tham gia xếp hạng**.

### Hệ thống thiết kế

`src/styles.css` — Tailwind v4 kiểu CSS-first, **không có `tailwind.config.js`**. Ba khối cần đọc: `@theme inline` (biến nào thành utility), `:root` (bảng màu oklch), `@layer utilities` (`.reveal`, `.bg-grid-soft`).

Bẫy hay gặp:

- Token tên `--emerald` thực chất là **màu teal** `#0A8B8D`, không phải emerald.
- Shadow và gradient **không** đăng ký trong `@theme`, nên phải dùng qua `style={{ boxShadow: "var(--shadow-soft)" }}` — có 28 chỗ inline như vậy.
- **Dark mode được định nghĩa đầy đủ nhưng không bao giờ được kích hoạt** (không nơi nào gắn class `.dark`).

### shadcn/ui phần lớn là scaffolding

46 tệp trong `src/components/ui/`, nhưng **chỉ `button`, `input`, `textarea` được dùng**, và chỉ bởi `src/components/demo/`. Toàn bộ trang marketing viết tay bằng Tailwind, không dùng shadcn. Đừng cho rằng một primitive nào đó "đang được dùng ở đâu đó".

### Bẫy đã biết trong mã

- **`useReveal` (`src/hooks/use-reveal.ts`)** chỉ quét `.reveal` **một lần lúc mount** với deps `[]`, gọi từ `index.tsx`. Phần tử gắn class `reveal` mà mount muộn hơn sẽ **kẹt ở `opacity: 0`**. Đây từng là lỗi thật ở `SignupSection`; cách chữa hiện tại là gắn thêm `is-visible` ngay trên phần tử đó.
- **`Countdown` (`shared.tsx`)** có `suppressHydrationWarning` trên cả hai `<span>`. **Đừng gỡ.** Đồng hồ lệch 1 giây giữa server và client làm React dựng lại toàn bộ cây; đo được 3/12 lần tải trước khi vá, 0/16 sau khi vá.
- **`store.tsx:41-47`** dựng lại mảng `loans` **mỗi giây** (`prev.map` luôn trả tham chiếu mới). Chưa gây vấn đề ở quy mô 3-5 hồ sơ, nhưng đáng nhớ khi thêm dữ liệu.
- **`SignupSection` không gửi dữ liệu đi đâu** — `onSubmit` chỉ `preventDefault()` + `setSubmitted(true)`. Không có backend nào cả.

## Kiểm chứng

Không có test tự động, nên **thay đổi phải được xác nhận bằng cách chạy thật**. Hành trình đáng chạy qua ở `/demo`: tải trực tiếp và refresh, đổi 3 vai trò, đổi hồ sơ, tạo hồ sơ giả, gửi đề xuất giả, chọn đề xuất, chờ hết giờ phiên, đặt lại demo. Theo dõi console — trạng thái mong đợi là **0 lỗi**.

Playwright bản global dùng được mà **không thêm vào `package.json`**:

```js
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)(
  "/opt/node22/lib/node_modules/playwright/index.js",
);
```

Để kiểm tra hết giờ phiên (tối thiểu 8 tiếng, không chờ thật được), dùng `page.clock.install()` + `page.clock.fastForward("07:00:00")`.

## Triển khai

Vercel, **zero-config** — không có `vercel.json`. `vite.config.ts` gọi `nitro()` không tham số; nitro tự nhận diện nền tảng: trên Vercel chọn preset `vercel` và xuất `.vercel/output`, ở local chọn `node` nên `npm run preview` dùng được.

**Vercel báo kết quả qua COMMIT STATUS, không phải check run.** Repo không có `.github/` nên `get_check_runs` luôn trả 0 — điều đó _không_ có nghĩa là không có CI. Phải dùng `pull_request_read` với method `get_status`, tìm context `Vercel`.

## Bối cảnh sản phẩm

AnFund là **sàn đấu giá vốn hai chiều** cho thị trường Việt Nam: người vay đã xác minh mở phiên có thời hạn, nhiều bên cho vay cạnh tranh bằng cách hạ lãi suất, người vay chọn bên thắng.

Hai quy tắc nghiệp vụ cứng (lặp lại ở 5 section marketing và mã hoá trong `types.ts`): **phiên đấu giá tối thiểu 8 giờ**, và **hồ sơ phải nộp trước tối thiểu 5 ngày, AnFund xác minh trong tối thiểu 5 ngày làm việc**.

Quan trọng khi sửa nội dung: `Footer.tsx:46-55` nêu rõ AnFund **hiện chỉ là ý tưởng/trang giới thiệu sản phẩm** — không phải ngân hàng hay tổ chức tín dụng, không cấp tín dụng, không nhận tiền gửi, không xử lý tiền thật. Mã nguồn trung thành với điều đó: không có luồng tiền nào. Đừng viết nội dung ngụ ý đây là dịch vụ tài chính đang vận hành.
