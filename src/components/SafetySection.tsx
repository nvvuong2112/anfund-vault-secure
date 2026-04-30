import {
  ShieldCheck,
  History,
  Eye,
  AlertTriangle,
  Lock,
  FileSignature,
  Scale,
  CalendarClock,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const SAFETY_POINTS = [
  {
    icon: ShieldCheck,
    title: "Xác minh hồ sơ trước 5 ngày",
    desc: "Người vay và người cho vay phải gửi đầy đủ hồ sơ trước 5 ngày để AnFund xét duyệt — chỉ hồ sơ đã xác minh mới được mở phiên đấu giá.",
  },
  {
    icon: CalendarClock,
    title: "Phê duyệt tối thiểu 5 ngày làm việc",
    desc: "AnFund đối chiếu thông tin và đánh giá rủi ro. Tuỳ độ phức tạp, thời gian phê duyệt là tối thiểu 5 ngày làm việc.",
  },
  {
    icon: History,
    title: "Lưu vết lịch sử đề xuất",
    desc: "Mỗi đề xuất, chỉnh sửa, lựa chọn đều được ghi nhận có thể truy vết phục vụ kiểm tra và đối soát.",
  },
  {
    icon: Eye,
    title: "Thông tin hiển thị rõ ràng",
    desc: "Lãi suất, kỳ hạn, điều kiện và yêu cầu bảo đảm được trình bày minh bạch trên cùng một giao diện.",
  },
  {
    icon: AlertTriangle,
    title: "Cảnh báo rủi ro",
    desc: "Cảnh báo trước mỗi giao dịch để cả hai bên hiểu rõ các rủi ro liên quan trước khi cam kết.",
  },
  {
    icon: Lock,
    title: "Bảo mật dữ liệu cá nhân",
    desc: "Mã hóa, kiểm soát truy cập và tôn trọng quyền riêng tư của người dùng theo nguyên tắc tối thiểu cần thiết.",
  },
  {
    icon: FileSignature,
    title: "Hỗ trợ ký kết hợp đồng",
    desc: "Quy trình xác minh và ký kết hợp đồng tuân thủ pháp luật, có hỗ trợ ký số và ký điện tử.",
  },
  {
    icon: Scale,
    title: "Tuân thủ pháp luật",
    desc: "Hoạt động theo quy định về tài chính, cho vay và bảo vệ dữ liệu hiện hành tại Việt Nam.",
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Minh bạch & an toàn"
          title={
            <>
              Có chọn lọc, kiểm soát rủi ro và{" "}
              <span className="text-primary">xác minh trước phiên đấu giá</span>
            </>
          }
          description="AnFund chỉ mở phiên đấu giá cho những hồ sơ đã được xác minh, đảm bảo cả người vay và người cho vay tham gia thị trường trên cùng một mặt bằng tin cậy."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAFETY_POINTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="reveal flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold text-foreground">{title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
