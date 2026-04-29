import { ArrowRight, Upload, FileText, Building2, Check, BarChart3, Handshake, ShieldCheck } from "lucide-react";

type StepProps = {
  index: number;
  title: string;
  caption: string;
  children: React.ReactNode;
};

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto w-[260px] h-[540px] rounded-[2.4rem] bg-card p-2 border border-border"
      style={{ boxShadow: "var(--shadow-phone)" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-card">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-primary/90" />
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-2.5 text-[10px] font-medium text-primary-foreground/90 relative z-10">
          <span>9:41</span>
          <span className="opacity-0">.</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div
      className="px-5 pt-3 pb-5 text-primary-foreground"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">
        Anfund
      </div>
      <div className="mt-1 text-base font-semibold">{title}</div>
    </div>
  );
}

function Step({ index, title, caption, children }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-sm font-semibold text-accent-foreground">
          {String(index).padStart(2, "0")}
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{caption}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ---------- Mockup screens ---------- */

function Screen1Submit() {
  return (
    <PhoneFrame>
      <Header title="Đăng hồ sơ vay" />
      <div className="px-4 pt-4 space-y-3">
        <div className="rounded-xl border border-dashed border-border bg-secondary/60 p-4 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-4 w-4 text-primary" />
          </div>
          <div className="text-[11px] font-medium text-foreground">Tải CMND / Sao kê</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">PDF, JPG • tối đa 10MB</div>
        </div>

        <div className="space-y-2">
          <Field label="Số tiền vay" value="500.000.000 ₫" />
          <Field label="Mục đích" value="Mua nhà" />
          <Field label="Thời hạn" value="120 tháng" />
          <Field label="Thu nhập / tháng" value="35.000.000 ₫" />
        </div>

        <button
          className="mt-2 w-full rounded-xl py-2.5 text-xs font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-navy)" }}
        >
          Gửi hồ sơ
        </button>
      </div>
    </PhoneFrame>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-[11px] font-medium text-foreground">{value}</div>
    </div>
  );
}

function Screen2Offers() {
  const offers = [
    { name: "Vietcombank", rate: "7.5%", amount: "500M", tag: "Tốt nhất" },
    { name: "Techcombank", rate: "7.9%", amount: "500M" },
    { name: "MB Bank", rate: "8.2%", amount: "480M" },
    { name: "ACB", rate: "8.5%", amount: "500M" },
  ];
  return (
    <PhoneFrame>
      <Header title="Đề xuất từ 12 ngân hàng" />
      <div className="px-4 pt-4 space-y-2.5">
        {offers.map((o, i) => (
          <div
            key={o.name}
            className={`flex items-center gap-3 rounded-xl border p-2.5 ${
              i === 0 ? "border-accent/60 bg-accent/5" : "border-border bg-card"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="text-[11px] font-semibold text-foreground truncate">{o.name}</div>
                {o.tag && (
                  <span className="rounded-full bg-accent/20 px-1.5 py-px text-[8px] font-semibold text-accent-foreground">
                    {o.tag}
                  </span>
                )}
              </div>
              <div className="text-[9px] text-muted-foreground">Lãi suất ưu đãi 12 tháng</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-bold text-primary">{o.rate}</div>
              <div className="text-[9px] text-muted-foreground">{o.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function Screen3Compare() {
  const rows = [
    { label: "Lãi suất", a: "7.5%", b: "7.9%", winner: "a" as const },
    { label: "Phí trả trước", a: "0%", b: "1.5%", winner: "a" as const },
    { label: "Giải ngân", a: "24h", b: "48h", winner: "a" as const },
    { label: "Bảo hiểm", a: "Có", b: "Không", winner: "a" as const },
  ];
  return (
    <PhoneFrame>
      <Header title="So sánh đề xuất" />
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-muted-foreground pb-2 border-b border-border">
          <div>Tiêu chí</div>
          <div className="text-center text-primary">Vietcombank</div>
          <div className="text-center">Techcombank</div>
        </div>
        <div className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-3 gap-2 py-2 items-center">
              <div className="text-[10px] text-foreground">{r.label}</div>
              <div className={`text-center text-[11px] font-semibold ${r.winner === "a" ? "text-primary" : "text-foreground"}`}>
                {r.winner === "a" && <Check className="inline h-3 w-3 mr-0.5 text-success" />}
                {r.a}
              </div>
              <div className="text-center text-[11px] text-muted-foreground">{r.b}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl bg-secondary/70 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
            <BarChart3 className="h-3 w-3 text-accent-foreground" />
            Tiết kiệm ước tính
          </div>
          <div className="mt-2 flex items-end gap-1 h-12">
            {[40, 55, 35, 70, 90, 65].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${i === 4 ? "bg-accent" : "bg-primary/70"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-1 text-[9px] text-muted-foreground">~ 42.000.000 ₫ / 10 năm</div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Screen4Match() {
  return (
    <PhoneFrame>
      <Header title="Khớp giao dịch" />
      <div className="px-4 pt-5 space-y-3">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
              <Handshake className="h-7 w-7 text-accent-foreground" />
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-primary-foreground">
              <Check className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-3 text-sm font-semibold text-foreground">Đã khớp thành công</div>
          <div className="text-[10px] text-muted-foreground">Vietcombank • 500.000.000 ₫</div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <div className="text-[10px] font-semibold text-foreground">Hợp đồng tín dụng</div>
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-border rounded" />
            <div className="h-1 w-5/6 bg-border rounded" />
            <div className="h-1 w-3/4 bg-border rounded" />
            <div className="h-1 w-4/5 bg-border rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <div className="text-[9px] text-muted-foreground">Bảo mật bởi Anfund • Mã hóa AES-256</div>
        </div>

        <button
          className="w-full rounded-xl py-2.5 text-xs font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-navy)" }}
        >
          Ký hợp đồng điện tử
        </button>
      </div>
    </PhoneFrame>
  );
}

/* ---------- Main section ---------- */

export function ProcessSection() {
  const steps = [
    { title: "Đăng hồ sơ vay", caption: "5 phút điền online", screen: <Screen1Submit /> },
    { title: "Hiển thị đề xuất", caption: "12+ ngân hàng đối tác", screen: <Screen2Offers /> },
    { title: "So sánh thông minh", caption: "Lãi suất, phí, ưu đãi", screen: <Screen3Compare /> },
    { title: "Khớp giao dịch", caption: "Ký số, giải ngân 24h", screen: <Screen4Match /> },
  ];

  return (
    <section className="bg-background py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Quy trình Anfund
          </div>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Vay vốn thông minh trong <span className="text-primary">4 bước</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Từ hồ sơ đến giải ngân — minh bạch, nhanh chóng, được bảo vệ ở mỗi bước.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-x-6 gap-y-16 lg:gap-x-2 xl:gap-x-6">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-center">
              <Step index={i + 1} title={s.title} caption={s.caption}>
                {s.screen}
              </Step>
              {i < steps.length - 1 && (
                <ArrowRight
                  className="hidden lg:block mx-2 xl:mx-4 mt-32 h-6 w-6 text-accent shrink-0"
                  strokeWidth={2.5}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
