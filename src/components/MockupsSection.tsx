import {
  Wallet,
  CalendarClock,
  Target,
  TrendingUp,
  History,
  ShieldCheck,
  Activity,
  Clock,
  Building2,
  Star,
  Gavel,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function MockupsSection() {
  return (
    <section id="mockups" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Mô phỏng giao diện sản phẩm"
          tone="gold"
          title={
            <>
              Sản phẩm AnFund qua <span className="text-primary">3 màn hình cốt lõi</span>
            </>
          }
          description="Từ hồ sơ vay đến phiên đấu giá vốn — giao diện được thiết kế cho người không chuyên tài chính vẫn có thể sử dụng dễ dàng."
        />

        <div className="mt-14 grid items-end gap-12 md:grid-cols-3 md:gap-6 lg:gap-10">
          <MockupColumn
            label="Mockup 1"
            title="Màn hình hồ sơ vay"
            caption="Người vay nhập đầy đủ thông tin, mở phiên đấu giá."
          >
            <Screen1Profile />
          </MockupColumn>
          <MockupColumn
            label="Mockup 2"
            title="Danh sách đề xuất từ người cho vay"
            caption="Người vay xem, so sánh đề xuất theo nhiều tiêu chí."
            elevated
          >
            <Screen2Offers />
          </MockupColumn>
          <MockupColumn
            label="Mockup 3"
            title="Phiên đấu giá vốn hai chiều"
            caption="Trạng thái phiên, đề xuất tốt nhất và lựa chọn nhanh."
          >
            <Screen3Auction />
          </MockupColumn>
        </div>
      </div>
    </section>
  );
}

function MockupColumn({
  label,
  title,
  caption,
  elevated,
  children,
}: {
  label: string;
  title: string;
  caption: string;
  elevated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`reveal flex flex-col items-center text-center ${elevated ? "md:-translate-y-4" : ""}`}
    >
      {children}
      <div className="mt-6 w-full max-w-xs">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-base font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{caption}</div>
      </div>
    </div>
  );
}

/* ---------- Phone frame ---------- */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto w-[280px] rounded-[2.4rem] border border-border bg-card p-2"
      style={{ boxShadow: "var(--shadow-phone)" }}
    >
      <div className="relative h-[580px] overflow-hidden rounded-[2rem] bg-card">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-primary/90" />
        <div className="flex items-center justify-between px-5 pt-2.5 text-[10px] font-medium text-primary-foreground/90 relative z-10">
          <span>9:41</span>
          <span className="opacity-0">.</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function PhoneHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div
      className="px-5 pt-3 pb-5 text-primary-foreground"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">
        AnFund
      </div>
      <div className="mt-1 text-base font-semibold">{title}</div>
      {subtitle && <div className="text-[11px] text-primary-foreground/70">{subtitle}</div>}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 text-primary" />
        {label}
      </div>
      <div className="mt-0.5 text-[12px] font-semibold text-foreground">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

/* ---------- Screen 1: Borrower profile ---------- */

function Screen1Profile() {
  return (
    <PhoneFrame>
      <PhoneHeader title="Hồ sơ vay HS-002389" subtitle="Trạng thái: Sẵn sàng đấu giá" />
      <div className="space-y-2.5 px-4 pt-4 pb-6">
        <div className="grid grid-cols-2 gap-2">
          <Field icon={Wallet} label="Số tiền vay" value="500.000.000 ₫" />
          <Field icon={CalendarClock} label="Kỳ hạn" value="120 tháng" />
          <Field icon={Target} label="Mục đích vay" value="Mua nhà ở" />
          <Field icon={TrendingUp} label="Thu nhập / tháng" value="35.000.000 ₫" />
        </div>

        <Field
          icon={History}
          label="Lịch sử tài chính"
          value="Tốt · CIC nhóm 1"
          sub="Đã vay 2 lần, không trễ hạn"
        />
        <Field icon={ShieldCheck} label="Tài sản bảo đảm" value="BĐS Q.7, định giá 1,2 tỷ" />
        <Field icon={Activity} label="Mức độ rủi ro" value="Thấp – Trung bình" />

        <div className="rounded-xl border border-emerald/30 bg-emerald/5 p-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald">
            <Clock className="h-3 w-3" />
            PHIÊN ĐẤU GIÁ VỐN
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Thời gian mở</div>
              <div className="text-[11px] font-semibold text-foreground">
                02 ngày 14 giờ 08 phút
              </div>
            </div>
            <span className="rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-emerald">
              Đang mở
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ---------- Screen 2: Offer list ---------- */

function Screen2Offers() {
  const offers = [
    {
      name: "Quỹ đầu tư An Tín",
      rate: "7,2%",
      amount: "500M",
      term: "120T",
      note: "BĐS · Giải ngân 24h",
      fit: 92,
      best: true,
    },
    {
      name: "Capital Partner V",
      rate: "7,5%",
      amount: "500M",
      term: "120T",
      note: "BĐS · 48h",
      fit: 88,
    },
    {
      name: "Mr. Nguyễn (Cá nhân)",
      rate: "7,8%",
      amount: "300M",
      term: "60T",
      note: "Tín chấp · 72h",
      fit: 75,
    },
    {
      name: "Việt Hưng Capital",
      rate: "8,0%",
      amount: "500M",
      term: "84T",
      note: "BĐS · 24h",
      fit: 81,
    },
  ];
  return (
    <PhoneFrame>
      <PhoneHeader
        title="Đề xuất từ người cho vay"
        subtitle="14 đề xuất · sắp xếp theo mức phù hợp"
      />
      <div className="space-y-2.5 px-4 pt-4 pb-6">
        {offers.map((o) => (
          <div
            key={o.name}
            className={`rounded-xl border p-3 ${o.best ? "border-emerald/40 bg-emerald/5" : "border-border bg-card"}`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[12px] font-semibold text-foreground">
                    {o.name}
                  </span>
                  {o.best && (
                    <span className="rounded-full bg-emerald/15 px-1.5 py-0.5 text-[8px] font-semibold text-emerald">
                      Tốt nhất
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">{o.note}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-primary">{o.rate}</div>
                <div className="text-[10px] text-muted-foreground">
                  {o.amount} · {o.term}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-medium text-foreground">
                <Star className="h-3 w-3 text-accent-foreground" />
                Phù hợp
              </div>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${o.best ? "bg-emerald" : "bg-primary"}`}
                  style={{ width: `${o.fit}%` }}
                />
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground">{o.fit}/100</div>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* ---------- Screen 3: Auction ---------- */

function Screen3Auction() {
  return (
    <PhoneFrame>
      <PhoneHeader title="Phiên đấu giá vốn" subtitle="Hai chiều · cạnh tranh minh bạch" />
      <div className="space-y-3 px-4 pt-4 pb-6">
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Gavel className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-foreground">HS-002389 · 500M</div>
                <div className="text-[9px] text-muted-foreground">Mua nhà · 120 tháng</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-[9px] font-semibold text-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
              Đang mở
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Mini label="Còn lại" value="02:14:08" />
            <Mini label="Đề xuất" value="14" />
            <Mini label="Tốt nhất" value="7,2%" highlight />
          </div>
        </div>

        <div className="rounded-xl border border-emerald/40 bg-emerald/5 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald">
            Đề xuất tốt nhất hiện tại
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-foreground">Quỹ đầu tư An Tín</div>
              <div className="text-[10px] text-muted-foreground">
                BĐS · Giải ngân 24h · Phí trả trước 0%
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-emerald">7,2%</div>
              <div className="text-[10px] text-muted-foreground">120 tháng</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Phân bố lãi suất các đề xuất
          </div>
          <div className="mt-2 flex h-12 items-end gap-1">
            {[55, 70, 90, 75, 50, 40, 30, 25, 20, 15].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${i < 3 ? "bg-emerald" : "bg-primary/60"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
            <span>7,0%</span>
            <span>8,5%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-xl border border-border bg-card py-2.5 text-[11px] font-semibold text-foreground">
            So sánh đề xuất
          </button>
          <button
            className="rounded-xl py-2.5 text-[11px] font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-navy)" }}
          >
            Chọn phương án phù hợp
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Mini({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card px-2 py-1.5">
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-[11px] font-bold ${highlight ? "text-emerald" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
