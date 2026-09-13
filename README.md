# AnFund

> **Kết nối dòng vốn, nâng tầm khát vọng**

Trang giới thiệu và bản demo tương tác cho **AnFund** — ý tưởng về một sàn đấu giá vốn hai chiều cho thị trường Việt Nam.

> [!IMPORTANT]
> **AnFund hiện là ý tưởng / nền tảng giới thiệu sản phẩm.** Không phải ngân hàng, công ty tài chính hay tổ chức tín dụng. Không trực tiếp cấp tín dụng, không nhận tiền gửi, không xử lý giao dịch tiền thật. Bản demo tại `/demo` chạy hoàn toàn bằng dữ liệu mẫu trong bộ nhớ trình duyệt.

## Ý tưởng sản phẩm

Ở mô hình vay truyền thống, người vay đi tìm vốn. AnFund đảo ngược việc đó: một hồ sơ tài chính tốt tự nó trở thành thứ mà các bên cho vay **cạnh tranh để giành**.

Người vay đã được xác minh mở một phiên đấu giá có thời hạn. Nhiều bên cho vay — quỹ đầu tư, doanh nghiệp, cá nhân — gửi đề xuất tài trợ và cạnh tranh bằng cách hạ lãi suất. Người vay chọn phương án tổng thể tốt nhất, không nhất thiết là lãi suất thấp nhất.

**Hai quy tắc nghiệp vụ cốt lõi:**

| Quy tắc                                       | Giá trị                                    |
| --------------------------------------------- | ------------------------------------------ |
| Thời lượng tối thiểu một phiên đấu giá        | **8 giờ**                                  |
| Nộp hồ sơ trước, và thời gian AnFund xác minh | **5 ngày** / tối thiểu **5 ngày làm việc** |

Quy trình: gửi hồ sơ ngày T-5 → AnFund xác minh ngày T-0 → mở phiên tối thiểu 8 giờ → khớp giao dịch và ký kết.

## Bắt đầu

Dự án dùng [Bun](https://bun.sh) làm công cụ quản lý gói.

```bash
bun install
npm run dev
```

Mở http://localhost:8080

| Đường dẫn | Nội dung                                                                     |
| --------- | ---------------------------------------------------------------------------- |
| `/`       | Trang giới thiệu, 14 section                                                 |
| `/demo`   | Demo tương tác — 3 vai trò: người vay, người cho vay, theo dõi phiên đấu giá |

## Các lệnh

```bash
npm run dev          # dev server (cổng 8080)
npm run build        # build production
npm run preview      # chạy thử bản build
npm run typecheck    # kiểm tra kiểu TypeScript
npm run lint         # ESLint
npm run test         # unit test (vitest)
npm run test:e2e     # E2E (Playwright) — tự khởi động dev server
npm run format       # Prettier
```

## Test và CI

| Loại | Nơi đặt                         | Nội dung                                                                    |
| ---- | ------------------------------- | --------------------------------------------------------------------------- |
| Unit | `src/components/demo/*.test.ts` | Formatter tiền tệ và thời gian, dữ liệu mẫu, hằng số nghiệp vụ              |
| E2E  | `e2e/*.spec.ts`                 | Hành trình thật của cả ba vai trò, vòng đời phiên đấu giá, biểu mẫu đăng ký |

Chạy E2E lần đầu cần tải trình duyệt: `npx playwright install chromium`.

Mỗi PR và mỗi lần push vào `main` đều chạy [CI](.github/workflows/ci.yml): typecheck, lint, kiểm tra định dạng, unit test và build ở một job; E2E ở job riêng.

## Công nghệ

| Lớp        | Công nghệ                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Framework  | [TanStack Start](https://tanstack.com/start) (SSR đầy đủ) + [TanStack Router](https://tanstack.com/router) |
| UI         | React 19, [Tailwind CSS v4](https://tailwindcss.com) (CSS-first, không có `tailwind.config.js`)            |
| Build      | Vite 7, [Nitro](https://nitro.build)                                                                       |
| Component  | [shadcn/ui](https://ui.shadcn.com) (new-york), [Lucide](https://lucide.dev)                                |
| Triển khai | [Vercel](https://vercel.com) (zero-config)                                                                 |

## Cấu trúc

```
src/
├── routes/          # __root.tsx (tài liệu HTML) · index.tsx (/) · demo.tsx (/demo)
├── components/
│   ├── *.tsx        # 14 section của trang giới thiệu
│   ├── demo/        # bản demo tương tác — phần logic thật của dự án
│   └── ui/          # primitive shadcn/ui
├── hooks/           # use-reveal (hiệu ứng cuộn) · use-mobile
├── lib/utils.ts     # cn()
└── styles.css       # token thiết kế Tailwind v4 (oklch)

e2e/                 # test Playwright
docs/                # tài liệu thiết kế
public/brand/        # bộ nhận diện thương hiệu
```

### Về bản demo

`src/components/demo/` là nơi chứa logic thật. Nó **chạy hoàn toàn phía client** — React Context + `useState`, không backend, không lưu trữ, không gọi mạng. Refresh trang là dữ liệu trở về mẫu ban đầu.

Bắt đầu đọc từ `types.ts` (mô hình miền, 65 dòng) rồi tới `store.tsx` (state và các mutation).

## Thương hiệu

**Rồng Việt dẫn vốn vươn khơi.** Logo gồm bốn biểu tượng: Rồng Việt (bản sắc và vai trò gìn giữ hệ sinh thái), Thuyền vốn (hành trình của dòng vốn), Dòng chảy (sự liền mạch), Ngôi sao (niềm tin dẫn lối).

Bảng màu: navy `#0A2D5E` · teal `#0A8B8D` · gold `#F2B233`

## Triển khai

Đẩy lên `main` là Vercel tự build và deploy. Không cần `vercel.json`, không cần biến môi trường — ứng dụng không phụ thuộc biến môi trường nào.

Nitro tự nhận diện nền tảng: trên Vercel dùng preset `vercel`, ở local dùng `node` (nhờ đó `npm run preview` chạy được).
