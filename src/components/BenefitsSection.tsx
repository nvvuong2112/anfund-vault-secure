import { Check, User, Banknote } from "lucide-react";
import { Eyebrow } from "./SectionHeading";

const BORROWER_BENEFITS = [
  "Đăng nhu cầu vay một lần, nhận nhiều đề xuất.",
  "Dễ so sánh lãi suất và điều kiện vay.",
  "Có thêm lựa chọn tài chính phù hợp.",
  "Lịch sử tài chính tốt → điều kiện cạnh tranh hơn.",
  "Tiết kiệm thời gian tìm kiếm nguồn vốn.",
  "Chủ động chọn phương án phù hợp nhất.",
  "An tâm hơn khi thông tin được trình bày rõ ràng.",
];

const LENDER_BENEFITS = [
  "Tiếp cận người vay có nhu cầu thật, đã được sàng lọc.",
  "Lọc hồ sơ theo khẩu vị rủi ro của bạn.",
  "Tìm kiếm người vay có lịch sử tài chính vững mạnh.",
  "Chủ động đưa ra đề xuất cạnh tranh.",
  "Theo dõi trạng thái giao dịch rõ ràng.",
  "Tối ưu cơ hội sử dụng vốn.",
  "Có thêm kênh tìm kiếm khoản vay phù hợp.",
];

export function BenefitsSection() {
  return (
    <>
      <BenefitColumn
        id="borrower"
        eyebrow="Lợi ích cho người vay"
        eyebrowTone="navy"
        icon={User}
        title="Biến hồ sơ tài chính tốt thành lợi thế khi vay vốn"
        description="Khi hồ sơ minh bạch và chất lượng, người vay được đặt vào vị trí trung tâm — nhiều bên cho vay sẵn sàng cạnh tranh để tài trợ."
        benefits={BORROWER_BENEFITS}
        align="left"
        accent="primary"
      />
      <BenefitColumn
        id="lender"
        eyebrow="Lợi ích cho người cho vay"
        eyebrowTone="emerald"
        icon={Banknote}
        title="Tìm đúng người vay, cạnh tranh để tài trợ hồ sơ chất lượng"
        description="AnFund mang đến công cụ để các bên cho vay sàng lọc, đánh giá và đề xuất với những hồ sơ vay phù hợp nhất với khẩu vị rủi ro."
        benefits={LENDER_BENEFITS}
        align="right"
        accent="emerald"
      />
    </>
  );
}

function BenefitColumn({
  id,
  eyebrow,
  eyebrowTone,
  icon: Icon,
  title,
  description,
  benefits,
  align,
  accent,
}: {
  id: string;
  eyebrow: string;
  eyebrowTone: "navy" | "emerald" | "gold";
  icon: React.ElementType;
  title: string;
  description: string;
  benefits: string[];
  align: "left" | "right";
  accent: "primary" | "emerald";
}) {
  const checkClass = accent === "emerald" ? "text-emerald" : "text-primary";
  const iconBg =
    accent === "emerald"
      ? "bg-emerald text-emerald-foreground"
      : "bg-primary text-primary-foreground";

  return (
    <section id={id} className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className={`grid items-start gap-10 lg:gap-16 lg:grid-cols-2 ${
            align === "right" ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div>
            <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
            <h2 className="reveal mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            <p className="reveal mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {description}
            </p>

            <div
              className={`reveal mt-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <ul
            className="reveal grid gap-3 rounded-3xl border border-border bg-card p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/40 p-4"
              >
                <Check className={`mt-0.5 h-4 w-4 shrink-0 ${checkClass}`} />
                <span className="text-sm text-foreground md:text-[15px]">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
