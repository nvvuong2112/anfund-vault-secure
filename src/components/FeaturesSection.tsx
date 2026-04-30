import { User, Banknote, Gavel, Check } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

type Feature = {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  intro: string;
  features: string[];
  tone: "navy" | "emerald" | "gold";
};

const FEATURES: Feature[] = [
  {
    id: "borrower",
    icon: User,
    badge: "Card 1",
    title: "Hồ sơ người vay",
    intro:
      "Dành cho cá nhân hoặc doanh nghiệp có nhu cầu vay vốn và muốn tiếp cận nhiều đề xuất tài chính cạnh tranh.",
    features: [
      "Tạo hồ sơ vay với thông tin đầy đủ.",
      "Nhập số tiền cần vay và chọn kỳ hạn vay.",
      "Mô tả mục đích vay rõ ràng.",
      "Cung cấp thu nhập, dòng tiền, lịch sử tài chính.",
      "Thêm tài sản bảo đảm nếu có.",
      "Thiết lập thời gian mở phiên đấu giá vốn.",
      "Theo dõi các đề xuất từ người cho vay.",
      "So sánh lãi suất, kỳ hạn và mức độ phù hợp.",
      "Chọn phương án phù hợp nhất.",
    ],
    tone: "navy",
  },
  {
    id: "lender",
    icon: Banknote,
    badge: "Card 2",
    title: "Nguồn vốn cho vay",
    intro:
      "Dành cho cá nhân, tổ chức hoặc đối tác có nguồn vốn và muốn tìm kiếm hồ sơ vay phù hợp để tài trợ.",
    features: [
      "Xem danh sách nhu cầu vay đã sàng lọc.",
      "Lọc hồ sơ theo số tiền, kỳ hạn, mục đích, tài sản bảo đảm và rủi ro.",
      "Xem lịch sử tài chính và đánh giá hồ sơ.",
      "Gửi đề xuất tài trợ với điều kiện riêng.",
      "Đưa ra lãi suất, kỳ hạn, số tiền và yêu cầu bảo đảm.",
      "Cạnh tranh với các bên cho vay khác.",
      "Theo dõi trạng thái đề xuất theo thời gian thực.",
      "Nhận thông báo khi đề xuất được người vay chọn.",
    ],
    tone: "emerald",
  },
  {
    id: "auction",
    icon: Gavel,
    badge: "Card 3",
    title: "Đấu giá vốn hai chiều",
    intro:
      "Cơ chế cốt lõi giúp thị trường vận hành minh bạch, cạnh tranh và hiệu quả hơn cho cả người vay lẫn người cho vay.",
    features: [
      "Mỗi khoản vay có một phiên đấu giá trong thời gian nhất định.",
      "Nhiều người cho vay có thể gửi đề xuất cạnh tranh.",
      "Hệ thống xếp hạng đề xuất theo lãi suất, kỳ hạn, điều kiện, uy tín và độ phù hợp.",
      "Người vay không nhất thiết chọn lãi suất thấp nhất.",
      "Người vay có thể chọn phương án tổng thể tốt nhất.",
      "Hồ sơ tài chính tốt thu hút nhiều bên cho vay cạnh tranh hơn.",
      "Khi hai bên đồng ý, hệ thống ghi nhận khớp giao dịch thành công.",
    ],
    tone: "gold",
  },
];

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Ba chức năng chính"
          title={
            <>
              Ba mảnh ghép vận hành <span className="text-primary">sàn đấu giá vốn hai chiều</span>
            </>
          }
          description="Mỗi vai trò trên AnFund đều có công cụ chuyên biệt — và tất cả gặp nhau ở phiên đấu giá vốn minh bạch."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon: Icon, badge, title, intro, features, tone } = feature;

  const ring =
    tone === "gold"
      ? "from-accent/30 to-accent/0"
      : tone === "emerald"
        ? "from-emerald/30 to-emerald/0"
        : "from-primary/30 to-primary/0";

  const iconBg =
    tone === "gold"
      ? "bg-accent text-accent-foreground"
      : tone === "emerald"
        ? "bg-emerald text-emerald-foreground"
        : "bg-primary text-primary-foreground";

  const checkColor =
    tone === "gold"
      ? "text-accent-foreground"
      : tone === "emerald"
        ? "text-emerald"
        : "text-primary";

  return (
    <div
      className="reveal relative rounded-3xl border border-border bg-card p-7 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r ${ring}`}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {badge}
        </span>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h3 className="mt-5 text-xl font-bold text-foreground md:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>

      <ul className="mt-6 space-y-2.5">
        {features.map((feat) => (
          <li key={feat} className="flex gap-3 text-sm text-foreground">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} />
            <span className="text-muted-foreground">{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
