import { CalendarDays, ShieldCheck, Hourglass, ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function VerificationSection() {
  return (
    <section id="verification" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Quy định AnFund"
          tone="emerald"
          title={
            <>
              Hai nguyên tắc nền tảng: <span className="text-emerald">xác minh trước</span> · phiên
              đấu giá <span className="text-primary">tối thiểu 8 giờ</span>
            </>
          }
          description="Để bảo vệ chất lượng thị trường, AnFund chỉ cho phép hồ sơ đã được xác minh tham gia, và mỗi phiên đấu giá đều phải đủ thời gian để cạnh tranh minh bạch."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <RuleCard
            icon={ShieldCheck}
            tone="emerald"
            ruleNumber="01"
            title="Xác minh hồ sơ trước khi tham gia"
            highlight="5 ngày + 5 ngày làm việc"
            steps={[
              {
                day: "T-5",
                label: "Gửi hồ sơ",
                desc: "Người vay và người cho vay gửi đầy đủ hồ sơ cho AnFund tối thiểu 5 ngày trước khi muốn mở/tham gia phiên đấu giá.",
              },
              {
                day: "T-5 đến T-0",
                label: "AnFund xét duyệt",
                desc: "AnFund đối chiếu thông tin, đánh giá rủi ro và phê duyệt. Thời gian phê duyệt tối thiểu 5 ngày làm việc, tuỳ độ phức tạp của hồ sơ.",
              },
              {
                day: "T-0",
                label: "Hồ sơ được xác minh",
                desc: 'Hồ sơ nhận trạng thái "Đã xác minh" — đủ điều kiện mở phiên đấu giá hoặc gửi đề xuất tài trợ.',
              },
            ]}
          />

          <RuleCard
            icon={Hourglass}
            tone="navy"
            ruleNumber="02"
            title="Phiên đấu giá vốn"
            highlight="Tối thiểu 8 giờ"
            steps={[
              {
                day: "Tối thiểu",
                label: "8 giờ",
                desc: "Mỗi phiên đấu giá vốn phải mở tối thiểu 8 giờ — đủ thời gian cho các bên cho vay xem xét, đánh giá và gửi đề xuất cạnh tranh.",
              },
              {
                day: "Tối đa",
                label: "Do bên mở phiên tự chọn",
                desc: "Người mở phiên đấu giá quyết định thời gian tối đa phù hợp với mức độ phức tạp của hồ sơ và mức độ khẩn cấp.",
              },
              {
                day: "Trong phiên",
                label: "Cạnh tranh minh bạch",
                desc: "Tất cả đề xuất hiển thị công khai cho người vay xem, so sánh và lựa chọn phương án phù hợp nhất.",
              },
            ]}
          />
        </div>

        <div
          className="reveal mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3 rounded-lg border border-emerald/30 bg-emerald/5 px-5 py-4 text-sm text-foreground"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <CalendarDays className="h-5 w-5 text-emerald" />
          <span>
            <span className="font-semibold">Lịch điển hình:</span> Gửi hồ sơ ngày T-5 → AnFund xác
            minh ngày T-0 → mở phiên đấu giá tối thiểu 8 giờ → khớp giao dịch và ký kết.
          </span>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Xem 6 bước chi tiết
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function RuleCard({
  icon: Icon,
  tone,
  ruleNumber,
  title,
  highlight,
  steps,
}: {
  icon: React.ElementType;
  tone: "emerald" | "navy";
  ruleNumber: string;
  title: string;
  highlight: string;
  steps: { day: string; label: string; desc: string }[];
}) {
  const accentText = tone === "emerald" ? "text-emerald" : "text-primary";
  const accentBg = tone === "emerald" ? "bg-emerald" : "bg-primary";
  const dotBg = tone === "emerald" ? "bg-emerald/15 text-emerald" : "bg-primary/10 text-primary";

  return (
    <div
      className="reveal relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${accentBg} text-primary-foreground`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Quy định {ruleNumber}
            </div>
            <h3 className="text-lg font-bold text-foreground md:text-xl">{title}</h3>
          </div>
        </div>
        <span
          className={`hidden sm:inline-flex items-center rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold ${accentText}`}
        >
          {highlight}
        </span>
      </div>

      <ol className="relative mt-6 ml-3 space-y-4 border-l border-dashed border-border pl-6">
        {steps.map((s, i) => (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ${dotBg} text-[10px] font-bold ring-4 ring-card`}
            >
              {i + 1}
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${dotBg}`}
              >
                {s.day}
              </span>
              <span className="text-sm font-semibold text-foreground">{s.label}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
