import { Logo } from "./Logo";

const NAV = [
  { href: "#home", label: "Trang chủ" },
  { href: "#how-it-works", label: "Cách hoạt động" },
  { href: "#borrower", label: "Người vay" },
  { href: "#lender", label: "Người cho vay" },
  { href: "#auction", label: "Đấu giá vốn" },
  { href: "#safety", label: "Chính sách bảo mật" },
  { href: "#signup", label: "Liên hệ" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <Logo className="h-11" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AnFund là nền tảng kết nối dòng vốn bằng niềm tin, dữ liệu và công nghệ, mang tinh
              thần Việt và khát vọng vươn xa.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Điều hướng
            </div>
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border border-border bg-secondary/40 p-5 text-xs leading-relaxed text-muted-foreground md:p-6">
          <div className="font-semibold text-foreground">Ghi chú pháp lý</div>
          <p className="mt-2">
            AnFund hiện là ý tưởng/nền tảng giới thiệu sản phẩm. AnFund không phải là ngân hàng,
            công ty tài chính hoặc tổ chức tín dụng. AnFund không trực tiếp cấp tín dụng, không nhận
            tiền gửi và không xử lý giao dịch tiền thật trong phiên bản giới thiệu. Mọi hoạt động
            vay và cho vay thực tế cần tuân thủ quy định pháp luật, xác minh danh tính, đánh giá rủi
            ro và ký kết hợp đồng hợp lệ giữa các bên liên quan.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} AnFund · AnVốn. All rights reserved.</div>
          <div>Where quality borrowers meet competitive capital.</div>
        </div>
      </div>
    </footer>
  );
}
