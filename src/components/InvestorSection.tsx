import { TrendingUp, BarChart3, Users, Cpu, Database, Network } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    title: "Thị trường vay vốn lớn",
    desc: "Nhu cầu vay từ cá nhân và doanh nghiệp luôn ở mức cao và đang tăng.",
  },
  {
    icon: BarChart3,
    title: "Cần so sánh minh bạch",
    desc: "Người dùng cần một nơi tập trung để so sánh nhiều phương án tài chính.",
  },
  {
    icon: Users,
    title: "Cần hồ sơ chất lượng",
    desc: "Người cho vay cần công cụ tìm kiếm hồ sơ phù hợp khẩu vị rủi ro.",
  },
  {
    icon: Cpu,
    title: "Công nghệ giảm chi phí",
    desc: "Tự động hoá có thể giảm chi phí tìm kiếm và thương lượng giữa hai bên.",
  },
  {
    icon: Database,
    title: "Dữ liệu giao dịch giá trị",
    desc: "Dữ liệu phiên đấu giá hỗ trợ đánh giá rủi ro chính xác hơn theo thời gian.",
  },
  {
    icon: Network,
    title: "Phân bổ vốn hiệu quả",
    desc: "Cơ chế cạnh tranh hai chiều giúp phân bổ vốn hiệu quả hơn cho thị trường.",
  },
];

export function InvestorSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Nhà đầu tư & đối tác"
          title={
            <>
              AnFund mở ra một cách tiếp cận mới cho{" "}
              <span className="text-primary">thị trường kết nối vốn</span>
            </>
          }
          description="AnFund hướng đến việc tạo ra một hạ tầng kết nối giữa nhu cầu vốn và nguồn vốn nhàn rỗi. Nền tảng giúp thị trường vận hành minh bạch, cạnh tranh và dữ liệu hóa quá trình tìm kiếm vốn."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="reveal rounded-lg border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald/10 text-emerald">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-base font-semibold text-foreground">{title}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
