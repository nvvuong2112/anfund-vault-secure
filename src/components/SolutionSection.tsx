import { Eye, Repeat, MousePointerClick, Filter } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const PILLARS = [
  {
    icon: Eye,
    title: "Minh bạch",
    desc: "Mọi đề xuất về lãi suất, kỳ hạn, số tiền, điều kiện giải ngân và yêu cầu bảo đảm được trình bày rõ ràng.",
  },
  {
    icon: Repeat,
    title: "Cạnh tranh hai chiều",
    desc: "Người vay cạnh tranh để có khoản vay tốt, người cho vay cạnh tranh để tiếp cận hồ sơ vay chất lượng.",
  },
  {
    icon: MousePointerClick,
    title: "Chủ động",
    desc: "Người vay chủ động chọn đề xuất phù hợp, người cho vay chủ động chọn hồ sơ phù hợp với khẩu vị rủi ro.",
  },
  {
    icon: Filter,
    title: "Có chọn lọc",
    desc: "Những hồ sơ vay tốt có thể thu hút nhiều đề xuất tốt hơn từ các bên cho vay khác nhau.",
  },
];

export function SolutionSection() {
  return (
    <section className="relative bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Giải pháp của AnFund"
          tone="emerald"
          title={
            <>
              Một thị trường vốn hai chiều, <span className="text-primary">minh bạch</span> và{" "}
              <span className="text-emerald">có chọn lọc</span>
            </>
          }
          description="AnFund giúp người vay đăng nhu cầu vay vốn và xây dựng hồ sơ tài chính rõ ràng. Các bên cho vay có thể xem, đánh giá và gửi đề xuất cạnh tranh. Người vay được quyền so sánh nhiều phương án, còn người cho vay được quyền lựa chọn các hồ sơ phù hợp."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="reveal group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
              </div>
              <div className="mt-4 text-lg font-semibold text-foreground">{title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
