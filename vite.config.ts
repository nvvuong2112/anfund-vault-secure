import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  // Thứ tự plugin có ý nghĩa — giữ nguyên như cấu hình trước đây.
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart(),
    // Không đặt preset: nitro tự nhận diện nền tảng. Trên Vercel nó chọn preset
    // `vercel` và xuất ra .vercel/output; ở máy local nó chọn `node` nên
    // `npm run preview` dùng được.
    nitro(),
    viteReact(),
  ],
  css: { transformer: "lightningcss" },
  resolve: {
    // Chặn việc bundle lẫn hai bản React khác nhau.
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  server: { port: 8080 },
});
