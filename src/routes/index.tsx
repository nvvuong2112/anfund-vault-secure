import { createFileRoute } from "@tanstack/react-router";
import { ProcessSection } from "@/components/ProcessSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anfund — Nền tảng kết nối vay vốn thông minh" },
      {
        name: "description",
        content:
          "Anfund kết nối bạn với 12+ ngân hàng, so sánh lãi suất minh bạch và giải ngân trong 24h.",
      },
      { property: "og:title", content: "Anfund — Vay vốn thông minh" },
      {
        property: "og:description",
        content: "Đăng hồ sơ, nhận đề xuất, so sánh và khớp giao dịch chỉ trong 4 bước.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <ProcessSection />
    </main>
  );
}
