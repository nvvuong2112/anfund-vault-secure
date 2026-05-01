import { Sailboat, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const SYMBOLS = [
  {
    icon: ShieldCheck,
    title: "Rồng Việt",
    desc: "Bản sắc, trí tuệ và vai trò bảo hộ hệ sinh thái vốn có kiểm soát.",
  },
  {
    icon: Sailboat,
    title: "Thuyền vốn",
    desc: "Hành trình đưa nguồn lực tài chính đến đúng người, đúng nhu cầu, đúng thời điểm.",
  },
  {
    icon: Waves,
    title: "Dòng chảy",
    desc: "Dòng vốn được lưu chuyển liền mạch giữa hồ sơ, đề xuất, xác minh và ký kết.",
  },
  {
    icon: Sparkles,
    title: "Ngôi sao",
    desc: "Điểm sáng dẫn đường cho niềm tin, mục tiêu và khát vọng phát triển dài hạn.",
  },
];

export function BrandStorySection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-5">
            <img
              src="/brand/anfund-logo-icon.png"
              alt="Biểu tượng Rồng Việt, thuyền vốn, sóng nước và ngôi sao của AnFund"
              className="mx-auto w-full max-w-sm object-contain"
            />
          </div>

          <div className="lg:col-span-7">
            <SectionHeading
              align="left"
              eyebrow="Định vị thương hiệu"
              tone="gold"
              title={
                <>
                  Một nét liền mạch cho <span className="text-primary">dòng vốn an tâm</span>
                </>
              }
              description="Logo AnFund kể câu chuyện về một nền tảng kết nối vốn bằng niềm tin, dữ liệu và công nghệ: có bản sắc Việt, có kiểm soát rủi ro, và có khát vọng vươn xa."
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SYMBOLS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="reveal border border-border bg-card p-5"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/8 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-base font-semibold text-foreground">{title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
