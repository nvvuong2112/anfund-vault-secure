import { createFileRoute } from "@tanstack/react-router";
import { DemoApp } from "@/components/demo/DemoLayout";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo AnFund — Trải nghiệm sàn đấu giá vốn hai chiều" },
      {
        name: "description",
        content:
          "Demo tương tác AnFund: tạo hồ sơ vay, gửi đề xuất tài trợ, theo dõi phiên đấu giá vốn trực tiếp.",
      },
    ],
  }),
  component: DemoApp,
});
