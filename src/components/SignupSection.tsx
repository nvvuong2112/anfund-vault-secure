import { useState } from "react";
import { CheckCircle2, User, Banknote, TrendingUp, Handshake, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

type Role = "borrower" | "lender" | "investor" | "partner";

const ROLES: { value: Role; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "borrower", label: "Người vay", icon: User, desc: "Tôi cần tìm nguồn vốn." },
  { value: "lender", label: "Người cho vay", icon: Banknote, desc: "Tôi có vốn cho vay." },
  {
    value: "investor",
    label: "Nhà đầu tư",
    icon: TrendingUp,
    desc: "Tôi muốn tìm hiểu cơ hội đầu tư.",
  },
  { value: "partner", label: "Đối tác", icon: Handshake, desc: "Tôi muốn hợp tác với AnFund." },
];

export function SignupSection() {
  const [role, setRole] = useState<Role>("borrower");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="signup" className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Đăng ký"
          tone="emerald"
          title={
            <>
              Tham gia danh sách chờ của <span className="text-primary">AnFund</span>
            </>
          }
          description="Để lại thông tin để được mời trải nghiệm phiên bản thử nghiệm và nhận cập nhật sớm nhất từ đội ngũ."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Bullet
              title="Phiên bản giới thiệu"
              desc="AnFund hiện ở giai đoạn giới thiệu sản phẩm — không xử lý giao dịch tiền thật."
            />
            <Bullet
              title="Ưu tiên người đăng ký sớm"
              desc="Người đăng ký sớm sẽ được mời tham gia chương trình thử nghiệm sản phẩm."
            />
            <Bullet
              title="Tôn trọng thông tin cá nhân"
              desc="Thông tin chỉ được dùng để liên hệ và cập nhật về sản phẩm AnFund."
            />
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <SuccessCard onReset={() => setSubmitted(false)} />
            ) : (
              <form
                onSubmit={onSubmit}
                className="reveal space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên" htmlFor="name">
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Nguyễn Văn A"
                      className="h-11 rounded-xl"
                    />
                  </Field>
                  <Field label="Số điện thoại" htmlFor="phone">
                    <Input
                      id="phone"
                      name="phone"
                      required
                      type="tel"
                      inputMode="tel"
                      placeholder="0900 000 000"
                      className="h-11 rounded-xl"
                    />
                  </Field>
                </div>

                <Field label="Email" htmlFor="email">
                  <Input
                    id="email"
                    name="email"
                    required
                    type="email"
                    placeholder="ban@email.com"
                    className="h-11 rounded-xl"
                  />
                </Field>

                <div>
                  <div className="mb-2 text-sm font-medium text-foreground">
                    Tôi quan tâm với vai trò
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const active = role === r.value;
                      return (
                        <button
                          type="button"
                          key={r.value}
                          onClick={() => setRole(r.value)}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
                            active
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border bg-secondary/40 hover:border-primary/30 hover:bg-primary/5",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-primary",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{r.label}</div>
                            <div className="text-xs text-muted-foreground">{r.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field label="Nhu cầu của bạn" htmlFor="message">
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Mô tả ngắn về nhu cầu của bạn (vd: số tiền vay, kỳ hạn, mục đích vay; hoặc nguồn vốn, khẩu vị rủi ro...)"
                    className="rounded-xl"
                  />
                </Field>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Bằng việc gửi thông tin, bạn đồng ý cho AnFund liên hệ về sản phẩm. Chúng tôi tôn
                  trọng quyền riêng tư và không xử lý giao dịch tiền thật trong phiên bản giới
                  thiệu.
                </p>

                <Button type="submit" size="lg" className="w-full rounded-full">
                  <Send className="h-4 w-4" />
                  Đăng ký nhận thông tin
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <div className="mb-1.5 text-sm font-medium text-foreground">{label}</div>
      {children}
    </label>
  );
}

function Bullet({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="reveal flex gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald/10">
        <CheckCircle2 className="h-5 w-5 text-emerald" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="reveal rounded-3xl border border-emerald/30 bg-emerald/5 p-8 text-center"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald text-emerald-foreground">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-foreground md:text-2xl">Đăng ký thành công</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
        Cảm ơn bạn đã quan tâm đến AnFund. Chúng tôi sẽ liên hệ khi phiên bản thử nghiệm sẵn sàng.
      </p>
      <Button variant="outline" className="mt-6 rounded-full" onClick={onReset}>
        Gửi đăng ký khác
      </Button>
    </div>
  );
}
