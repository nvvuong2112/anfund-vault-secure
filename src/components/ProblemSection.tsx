import { Search, Scale, FileQuestion, Award, Users, Filter, Sliders, Trophy } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const BORROWER_PROBLEMS = [
  { icon: Search, text: "Khó tìm được nguồn vốn phù hợp với nhu cầu thực tế." },
  { icon: Scale, text: "Phải liên hệ nhiều nơi để so sánh lãi suất và điều kiện." },
  { icon: FileQuestion, text: "Điều kiện vay chưa được trình bày minh bạch, đầy đủ." },
  { icon: Award, text: "Hồ sơ tài chính tốt chưa chắc nhận được điều kiện tương xứng." },
];

const LENDER_PROBLEMS = [
  { icon: Users, text: "Khó tiếp cận người vay có nhu cầu thật và đã được sàng lọc." },
  { icon: Filter, text: "Khó đánh giá và so sánh nhiều hồ sơ vay cùng lúc." },
  { icon: Sliders, text: "Thiếu công cụ lọc theo khẩu vị rủi ro và mục tiêu sử dụng vốn." },
  { icon: Trophy, text: "Khó cạnh tranh minh bạch để tiếp cận hồ sơ vay chất lượng." },
];

export function ProblemSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Vấn đề thị trường"
          title={
            <>
              Thị trường vay và cho vay vẫn còn{" "}
              <span className="text-primary">thiếu minh bạch</span>
            </>
          }
          description="Hai phía của thị trường đều gặp những rào cản tương tự — thiếu thông tin, thiếu công cụ so sánh, và thiếu một sân chơi cạnh tranh công bằng."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <ProblemColumn badge="Đối với người vay" badgeTone="navy" problems={BORROWER_PROBLEMS} />
          <ProblemColumn
            badge="Đối với người cho vay"
            badgeTone="gold"
            problems={LENDER_PROBLEMS}
          />
        </div>
      </div>
    </section>
  );
}

function ProblemColumn({
  badge,
  badgeTone,
  problems,
}: {
  badge: string;
  badgeTone: "navy" | "gold";
  problems: { icon: React.ElementType; text: string }[];
}) {
  return (
    <div
      className="reveal rounded-3xl border border-border bg-card p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-2.5 w-2.5 rounded-full ${badgeTone === "gold" ? "bg-accent" : "bg-primary"}`}
        />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {badge}
        </span>
      </div>
      <ul className="mt-6 space-y-4">
        {problems.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${badgeTone === "gold" ? "bg-accent/15" : "bg-primary/8"}`}
            >
              <Icon
                className={`h-5 w-5 ${badgeTone === "gold" ? "text-accent-foreground" : "text-primary"}`}
              />
            </div>
            <span className="pt-1.5 text-sm text-foreground md:text-[15px]">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
