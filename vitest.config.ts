import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

// Cấu hình riêng, không dùng chung vite.config.ts: cấu hình build có nitro và
// tanstackStart — những thứ vitest không cần và sẽ làm chậm việc chạy test.
export default defineConfig({
  plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  test: {
    include: ["src/**/*.test.ts"],
    // e2/ là của Playwright, vitest không được đụng vào.
    exclude: ["e2e/**", "node_modules/**"],
    environment: "node",
  },
});
