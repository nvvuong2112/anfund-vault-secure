# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cách trao đổi với chủ dự án

Chủ dự án tự nhận là **dân vibe coding**: quan tâm kết quả và tác động, không quan tâm chi tiết công cụ. Làm xong việc gì thì giải thích bằng tiếng Việt đời thường, theo đúng bốn ý:

1. **Nó làm được gì** — mô tả bằng ngôn ngữ người dùng, không phải bằng tên công cụ.
2. **Vì sao phải làm** — chuyện gì xảy ra nếu không làm.
3. **Đổi cái gì** — tệp nào, và mỗi thay đổi có ý nghĩa gì. Đừng dán diff.
4. **Sẽ thấy khác gì** — thay đổi cụ thể trong thói quen hằng ngày.

Bốn quy tắc kèm theo:

- **Nói cả cái mất.** Đánh đổi và thứ bị hy sinh phải nêu thẳng, không giấu sau phần kết quả tốt.
- **Giải thích thuật ngữ ngay lần đầu dùng.** Ví dụ "E2E" phải kèm "loại test mở trình duyệt thật, bấm thử như người dùng".
- **Phân biệt đã kiểm chứng với suy luận.** Nói rõ cái gì tận mắt thấy, cái gì chỉ suy ra, và vì sao không kiểm được.
- **Bảng ngắn hơn đoạn văn dài.** Không dán log thô trừ khi được hỏi.

## Lệnh thường dùng

`bun` là công cụ quản lý gói chính thức (`bunfig.toml` + `bun.lockb`). Không tạo lại `package-lock.json` — nó đã bị xoá và nằm trong `.gitignore`.

```bash
bun install          # cài phụ thuộc
npm run dev          # dev server tại http://localhost:8080
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run test         # vitest run — unit test
npm run test:watch   # vitest ở chế độ theo dõi
npm run test:e2e     # playwright test — tự khởi động dev server
npm run format       # prettier --write .
npm run build        # build production
npm run preview      # chạy thử bản build

npm run check        # typecheck + lint + test — ĐÚNG cổng chặn deploy Vercel
npm run verify       # check + prettier --check . + build — chạy trước khi push
```

Chạy một tệp test hoặc một test lẻ:

```bash
npm run test -- shared.test.ts                  # một tệp unit test
npm run test -- -t "formatVND"                  # lọc theo tên
npm run test:e2e -- e2e/demo.spec.ts            # một tệp E2E
npm run test:e2e -- --grep "hydration"          # lọc theo tên
npm run test:e2e -- --headed --project=chromium # xem trình duyệt chạy
```

`typecheck`, `lint`, `prettier --check .` và cả hai bộ test hiện đều **sạch**; hãy giữ nguyên như vậy. `npm run check` (typecheck + lint + test) **chặn deploy Vercel** nếu đỏ — xem mục CI. `lint` còn đúng **3 cảnh báo `react-refresh`**, cả ba đều cố ý chừa — xem mục CI để biết vì sao từng cái. Cảnh báo không chặn gì, chỉ `error` mới chặn.

## Kiến trúc

TanStack Start (SSR đầy đủ) + React 19 + Vite 7, Tailwind v4, triển khai lên **Vercel**.

```
src/routes/__root.tsx   → toàn bộ tài liệu HTML (shellComponent), <html lang="vi">, mọi thẻ meta/OG
src/routes/index.tsx    → "/"      14 section marketing, import tĩnh
src/routes/demo.tsx     → "/demo"  DemoApp, 100% state phía client
```

`design/` **không phải mã chạy** — không tệp nào trong `src/` import nó, nó không tham gia build. Đó là nguồn của canvas thiết kế mobile, viết bằng định dạng khuôn mẫu riêng (`.dc.html`) nên đã nằm trong `.prettierignore`; bản dựng 2,5 MB nằm trong `.gitignore`. Đọc `design/README.md` trước khi đụng vào.

Chỉ **hai route**, không lazy-load ở đâu. `src/router.tsx` không đặt gì vào router context; `__root.tsx` **không mount provider nào** (không QueryClient, không Toaster, không theme provider) — đó là chỗ để thêm nếu cần.

`src/routeTree.gen.ts` là **tệp sinh tự động**. Plugin router ghi đè nó mỗi lần chạy `dev`/`build`, thường chỉ đổi thứ tự route. Đừng sửa tay, và nếu nó bẩn sau khi chạy build thì `git restore` là đúng.

### Nơi logic thật nằm

`src/components/demo/` (~2.600 dòng) là phần ứng dụng thực sự. Các section marketing chỉ là nội dung tĩnh.

- **`types.ts`** — mô hình miền, đọc cái này trước. Chỉ 6 kiểu, không enum. Hai hằng số nghiệp vụ duy nhất của dự án nằm cuối tệp: `MIN_AUCTION_HOURS = 8`, `VERIFICATION_DAYS = 5`.
- **`store.tsx`** — React Context + `useState` (không phải `useReducer`). **Không lưu trữ, không gọi mạng** — refresh trang là mất sạch. Đồng hồ 1 Hz ở dòng 32-35 đẩy `now` xuống toàn bộ cây.
- **`seed.ts`** — 3 khoản vay mẫu, 7 đề xuất, 9 bên cho vay giả. `generateAutoOffer` mô phỏng đối thủ cạnh tranh.
- **`format.ts`** — mọi hàm thuần: formatter tiền tệ/thời gian (`formatVND`, `formatRate`, `formatCountdown`…) và `lenderTypeLabel`. Tách riêng khỏi `shared.tsx` để hot-reload không thổi bay state demo mỗi lần sửa badge.
- **`shared.tsx`** — chỉ còn component: `Countdown`, `LenderIcon`, và bốn badge. **Đừng thêm hàm thuần vào đây** — chỗ của chúng là `format.ts`. Cũng đừng đặt tên tệp mới là `shared.ts`: có cả `.ts` lẫn `.tsx` thì `import from "./shared"` nhập nhằng, thứ tự phân giải quyết định trong im lặng.

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

### shadcn/ui chỉ còn 3 primitive

`src/components/ui/` chỉ có `button`, `input`, `textarea` — và chỉ `src/components/demo/` dùng chúng. Toàn bộ trang marketing viết tay bằng Tailwind, không dùng shadcn.

Trước đây thư mục này có 46 tệp; 43 tệp chưa từng được import đã bị xoá cùng 37 gói npm đi kèm. `components.json` vẫn còn, nên cần primitive nào thì thêm lại bằng `npx shadcn@latest add <tên>` — đừng chép tay.

### Bẫy đã biết trong mã

- **`useReveal` (`src/hooks/use-reveal.ts`)** chỉ quét `.reveal` **một lần lúc mount** với deps `[]`, gọi từ `index.tsx`. Phần tử gắn class `reveal` mà mount muộn hơn sẽ **kẹt ở `opacity: 0`**. Đây từng là lỗi thật ở `SignupSection`; cách chữa hiện tại là gắn thêm `is-visible` ngay trên phần tử đó.
- **`Countdown` (`shared.tsx`)** có `suppressHydrationWarning` trên cả hai `<span>`. **Đừng gỡ.** Đồng hồ lệch 1 giây giữa server và client làm React dựng lại toàn bộ cây; đo được 3/12 lần tải trước khi vá, 0/16 sau khi vá.
- **`store.tsx:37-43`** dựng lại mảng `loans` **mỗi giây** (`prev.map` luôn trả tham chiếu mới). Chưa gây vấn đề ở quy mô 3-5 hồ sơ, nhưng đáng nhớ khi thêm dữ liệu.
- **`SignupSection` không gửi dữ liệu đi đâu** — `onSubmit` chỉ `preventDefault()` + `setSubmitted(true)`. Không có backend nào cả.

## Test

```
src/components/demo/*.test.ts   unit (vitest) — formatter, dữ liệu mẫu, hằng số nghiệp vụ
e2e/*.spec.ts                   E2E (Playwright) — hành trình thật trong trình duyệt
```

Ranh giới: vitest **chỉ** nhận `src/**/*.test.ts`, Playwright **chỉ** nhận `e2e/`. Đừng đặt lẫn, hai runner sẽ giẫm chân nhau.

Phần lớn test E2E ở đây là **test hồi quy cho lỗi đã từng xảy ra thật**, mỗi cái có chú thích nêu rõ lỗi gốc. Đừng nới lỏng chúng cho "đỡ vướng" — hãy đọc chú thích trước.

Vài điều cần biết khi viết thêm test:

- Ứng dụng **không có backend**, nên E2E không cần dựng dữ liệu hay dọn dẹp gì. Nút "Đặt lại demo" đưa mọi thứ về mẫu ban đầu.
- Phiên đấu giá ngắn nhất là 8 tiếng, không chờ thật được → dùng `page.clock.install()` + `page.clock.fastForward("07:00:00")`.
- Đề xuất tự động chảy vào trong khoảng **2,5–14 giây** sau khi tạo hồ sơ; hãy chờ theo phần tử với timeout rộng, đừng `waitForTimeout` cứng.
- Lỗi hydration từng chỉ xuất hiện ~25% số lần tải, nên test hydration **lặp nhiều lần**. Một lần tải là không đủ tin.
- `toBeVisible()` của Playwright **không** kiểm tra `opacity`. Lỗi `SignupSection` từng lọt đúng vì vậy — muốn chắc thì đọc `getComputedStyle`.
- Helper dùng chung nằm ở `e2e/helpers.ts` (thu lỗi console, đổi vai trò, chọn hồ sơ, đọc form).

`playwright.config.ts` tự khởi động `npm run dev`; ở local nó tái dùng server đang chạy nếu có.

## CI

**Cổng chặn nằm trong build Vercel, không phải GitHub Actions.**

`package.json` khai báo `vercel-build`, và Vercel ưu tiên script này hơn lệnh build mặc định của framework preset. Nội dung là `npm run check && npm run build`, nên **bất kỳ bước nào trong `check` đỏ là deployment hỏng** — kể cả preview của PR. Đây là cổng thật, đã kiểm chứng bằng đột biến mã: lỗi kiểu dừng ở `typecheck`, vi phạm `rules-of-hooks` dừng ở `lint`, cả hai đều không chạy tới bước build.

Ranh giới ai bắt cái gì, cần nhớ vì không hiển nhiên:

| Loại lỗi                                         | `check` (chặn deploy)                                                                         | chỉ `verify` (local)            |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------- |
| Sai kiểu TypeScript                              | ✅ `typecheck`                                                                                |                                 |
| `react-hooks/rules-of-hooks`                     | ✅ `lint` (mức `error`)                                                                       |                                 |
| Unit test đỏ                                     | ✅ `test`                                                                                     |                                 |
| Lệch định dạng trong `.ts`/`.tsx`                | ✅ `lint` — config có `eslint-plugin-prettier/recommended`, `prettier/prettier` ở mức `error` |                                 |
| Lệch định dạng trong `.md`/`.json`/`.yml`/`.css` |                                                                                               | ✅ `prettier --check .`         |
| `react-refresh/only-export-components`           |                                                                                               | chỉ là `warning`, không chặn gì |

Nói cách khác: định dạng **mã nguồn** đã bị chặn sẵn qua eslint; `prettier --check .` chỉ thêm phần tài liệu và cấu hình, nên để ở `verify` chạy tay.

### Ba cảnh báo react-refresh cố ý chừa

`lint` còn đúng 3 cảnh báo, đều là `react-refresh/only-export-components`. Đừng "sửa hộ" — mỗi cái đã được cân nhắc và tách ra chỉ tốn công, không được lợi:

| Chỗ                                               | Vì sao chừa                                                                                                            |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/components/ui/button.tsx` (`buttonVariants`) | Tệp shadcn sinh tự động. Tách tay là lệch khỏi bản gốc, lần sau `npx shadcn@latest add button` sẽ đè mất hoặc xung đột |
| `src/components/demo/store.tsx` (`useDemo`)       | Tách hook khỏi provider phải sửa 5 tệp, đổi lại không được lợi ích chạy máy nào                                        |
| `src/router.tsx` (`DefaultErrorComponent`)        | Một component trong tệp hạ tầng, không đáng một tệp riêng                                                              |

Bảy cảnh báo còn lại (ở `shared.tsx`) đã xử bằng cách tách `format.ts` — chỗ đó tách có lợi thật, vì sửa badge là việc làm thường xuyên và hot-reload giữ được state demo.

### GitHub Actions đang tắt

`.github/workflows/ci.yml` còn nguyên nhưng **chỉ còn trigger `workflow_dispatch`**. Lý do: tài khoản chưa có phương thức thanh toán, Actions không cấp runner — mọi lượt chạy chết sau 2 giây với `The job was not started because your account is locked due to a billing issue` (`runner_id: 0`, không có log, đã tái hiện y hệt 2 lượt). Để trigger tự động thì mỗi PR nhận 2 check đỏ vĩnh viễn vô nghĩa, và lỗi thật sau này sẽ lẫn vào đó.

Bản thân workflow **đã được chứng minh là đúng** — parse được, lên lịch job đúng tên. Khi tài khoản có thẻ, bỏ chú thích 3 dòng `push`/`pull_request` trong khối `on:` là chạy lại ngay.

**Mất mát thật cần biết: E2E không được chạy tự động ở đâu cả.** Playwright cần tải trình duyệt nên không hợp với build Vercel. Chạy `npm run test:e2e` bằng tay trước khi push nếu có đụng tới `src/components/demo/`. Đây là lý do chính đáng nhất để mở khoá billing sau này.

Job trong `ci.yml` dùng `bun install --frozen-lockfile`, nên khi bật lại thì **`package.json` lệch `bun.lockb` sẽ làm hỏng CI** — đúng ý đồ: repo này từng mang một lockfile lệch suốt 4 tháng mà không ai biết.

## Triển khai

Vercel, **zero-config** — không có `vercel.json`. `vite.config.ts` gọi `nitro()` không tham số; nitro tự nhận diện nền tảng: trên Vercel chọn preset `vercel` và xuất `.vercel/output`, ở local chọn `node` nên `npm run preview` dùng được.

**Vercel báo kết quả qua COMMIT STATUS, không phải check run.** `get_check_runs` chỉ thấy GitHub Actions và "Vercel Preview Comments" — muốn biết deploy thành công hay không thì phải dùng `pull_request_read` với method `get_status` và tìm context `Vercel`. Nhầm hai thứ này rất dễ dẫn tới kết luận sai là repo không có CI.

## Bối cảnh sản phẩm

AnFund là **sàn đấu giá vốn hai chiều** cho thị trường Việt Nam: người vay đã xác minh mở phiên có thời hạn, nhiều bên cho vay cạnh tranh bằng cách hạ lãi suất, người vay chọn bên thắng.

Hai quy tắc nghiệp vụ cứng (lặp lại ở 5 section marketing và mã hoá trong `types.ts`): **phiên đấu giá tối thiểu 8 giờ**, và **hồ sơ phải nộp trước tối thiểu 5 ngày, AnFund xác minh trong tối thiểu 5 ngày làm việc**.

Quan trọng khi sửa nội dung: `Footer.tsx:46-55` nêu rõ AnFund **hiện chỉ là ý tưởng/trang giới thiệu sản phẩm** — không phải ngân hàng hay tổ chức tín dụng, không cấp tín dụng, không nhận tiền gửi, không xử lý tiền thật. Mã nguồn trung thành với điều đó: không có luồng tiền nào. Đừng viết nội dung ngụ ý đây là dịch vụ tài chính đang vận hành.
