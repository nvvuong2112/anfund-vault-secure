import { expect, test } from "@playwright/test";
import { collectPageErrors, hydrationErrors } from "./helpers";

test.describe("/ — trang giới thiệu", () => {
  test("tải được, không lỗi console, không lệch hydration", async ({ page }) => {
    const errors = collectPageErrors(page);

    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/AnFund/);
    await expect(page.locator("main")).toBeVisible();

    expect(hydrationErrors(errors)).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("chỉ có đúng một landmark main và trang khai báo tiếng Việt", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("liên kết bỏ qua điều hướng hiện ra khi nhận focus bàn phím", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const skip = page.getByRole("link", { name: /Bỏ qua điều hướng/ });
    await expect(skip).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
  });

  test("nêu rõ tuyên bố pháp lý ở footer", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Đây là ràng buộc nội dung, không phải trang trí: sản phẩm mang hình dạng
    // dịch vụ tài chính nên tuyên bố này phải luôn hiện diện.
    await expect(page.locator("footer")).toContainText("không phải là ngân hàng");
  });
});

test.describe("Biểu mẫu đăng ký", () => {
  // Hồi quy: useReveal chỉ quét .reveal một lần lúc mount. SuccessCard gắn class
  // `reveal` nhưng mount SAU khi bấm gửi, nên không bao giờ được cấp `is-visible`
  // và kẹt ở opacity 0 — người dùng gửi xong không thấy phản hồi nào.
  test("thẻ thành công hiển thị thật sự, không kẹt ở opacity 0", async ({ page }) => {
    await page.goto("/#signup", { waitUntil: "networkidle" });
    await page.locator("#signup").scrollIntoViewIfNeeded();

    await page.getByLabel(/Họ và tên/i).fill("Nguyễn Văn Demo");
    await page.getByLabel(/Số điện thoại/i).fill("0900000000");
    await page.getByLabel(/Email/i).fill("demo@example.com");
    await page
      .getByRole("button", { name: /Đăng ký|Gửi đăng ký/ })
      .first()
      .click();

    const card = page.getByText("Đăng ký thành công").first();
    await expect(card).toBeVisible();

    // toBeVisible() KHÔNG kiểm tra opacity, nên phải đọc style tính toán.
    const opacity = await card.evaluate((el) => {
      const wrapper = el.closest(".reveal") ?? el.parentElement!;
      return getComputedStyle(wrapper).opacity;
    });
    expect(Number(opacity)).toBe(1);
  });
});
