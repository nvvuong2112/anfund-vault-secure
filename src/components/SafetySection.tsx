import { ShieldCheck, History, Eye, AlertTriangle, Lock, FileSignature, Scale } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const SAFETY_POINTS = [
  {
    icon: ShieldCheck,
    title: "Xác minh danh tính",
    desc: "Quy trình KYC cho cá nhân và doanh nghiệp trước khi tham gia.",
  },
  {
    icon: History,
    title: "Lưu vết lịch sử đề xuất",
    desc: "Mỗi đề xuất, chỉnh sửa, lựa chọn đều được ghi nhận có thể truy vết.",
  },
  {
    icon: Eye,
    title: "Thông tin hiển thị rõ ràng",
    desc: "Lãi suất, kỳ hạn, điều kiện và yêu cầu bảo đảm được trình bày minh bạch.",
  },
  {
    icon: AlertTriangle,
    title: "Cảnh báo rủi ro",
    desc: "Cảnh báo trước mỗi giao dịch để các bên hiểu rõ rủi ro liên quan.",
  },
  {
    icon: Lock,
    title: "Bảo mật dữ liệu cá nhân",
    desc: "Mã hóa, kiểm soát truy cập và tôn trọng quyền riêng tư của người dùng.",
  },
  {
    icon: FileSignature,
    title: "Hỗ trợ xác minh & ký kết",
    desc: "Quy trình xác minh và ký kết hợp đồng tuân thủ pháp luật.",
  },
  {
    icon: Scale,
    title: "Tuân thủ pháp luật",
    desc: "Hoạt động theo quy định về tài chính, cho vay và bảo vệ dữ liệu.",
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
              Minh bạch, kiểm soát rủi ro và{" "}
              <span className="text-primary">tôn trọng dữ liệu người dùng</span>
            </>
          }
          description="AnFund hướng đến một môi trường kết nối tài chính rõ ràng, có kiểm soát và tôn trọng quyền riêng tư trong từng giao dịch."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAFETY_POINTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="reveal flex gap-4 rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
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
