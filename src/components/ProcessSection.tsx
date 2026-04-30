import { FileCheck2, ShieldCheck, Timer, Send, GitCompareArrows, ScrollText } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    icon: FileCheck2,
    title: "Gửi hồ sơ trước 5 ngày",
    desc: "Người vay và người cho vay gửi hồ sơ đầy đủ cho AnFund tối thiểu 5 ngày trước khi muốn tham gia phiên đấu giá.",
    badge: "Trước phiên đấu giá",
  },
  {
    icon: ShieldCheck,
    title: "AnFund xác minh & phê duyệt",
    desc: "AnFund đối chiếu thông tin, đánh giá rủi ro và phê duyệt hồ sơ. Thời gian xét duyệt tối thiểu 5 ngày làm việc, tuỳ độ phức tạp.",
    badge: "5 ngày làm việc",
  },
  {
    icon: Timer,
    title: "Mở phiên đấu giá vốn",
    desc: "Hồ sơ đã xác minh được mở phiên. Thời gian phiên tối thiểu 8 giờ, tối đa do bên mở phiên tự chọn.",
    badge: "Tối thiểu 8 giờ",
  },
  {
    icon: Send,
    title: "Đề xuất cạnh tranh",
    desc: "Người cho vay đã xác minh xem hồ sơ, gửi đề xuất về lãi suất, kỳ hạn, số tiền tài trợ, điều kiện và yêu cầu bảo đảm.",
  },
  {
    icon: GitCompareArrows,
    title: "So sánh và chọn phương án",
    desc: "Người vay so sánh các đề xuất theo tổng thể (lãi suất, kỳ hạn, điều kiện, mức phù hợp) và chọn phương án phù hợp nhất.",
  },
  {
    icon: ScrollText,
    title: "Ký kết và hoàn tất",
    desc: "Hai bên xác nhận, ký hợp đồng và giải ngân theo quy định pháp luật. Lịch sử giao dịch được lưu vết trên AnFund.",
  },
];

export function ProcessSection() {
  return (
    <section id="how-it-works" className="relative bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Quy trình hoạt động"
          title={
            <>
              Sáu bước có chọn lọc — từ <span className="text-primary">xác minh</span> đến{" "}
              <span className="text-emerald">khớp giao dịch</span>
            </>
          }
          description="Mỗi hồ sơ trên AnFund đều phải gửi trước 5 ngày để xét duyệt và được xác minh tối thiểu 5 ngày làm việc. Phiên đấu giá tối thiểu 8 giờ, đảm bảo đủ thời gian cạnh tranh minh bạch."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, idx) => (
            <StepCard key={s.title} index={idx + 1} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  index,
  step,
}: {
  index: number;
  step: { icon: React.ElementType; title: string; desc: string; badge?: string };
}) {
  const { icon: Icon, title, desc, badge } = step;
  return (
    <div
      className="reveal group relative rounded-2xl border border-border bg-card p-6 md:p-7"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-3xl font-bold tracking-tight text-muted-foreground/40">
          {String(index).padStart(2, "0")}
        </div>
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground md:text-lg">
        Bước {index}: {title}
      </h3>
      {badge && (
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/5 px-2.5 py-0.5 text-[10px] font-semibold text-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
          {badge}
        </span>
      )}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
