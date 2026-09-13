import type { Page } from "@playwright/test";

/**
 * Thu lỗi console và lỗi runtime của trang.
 * Gọi TRƯỚC page.goto, nếu không sẽ bỏ sót lỗi lúc tải.
 */
export function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[console.error] ${m.text()}`);
  });
  return errors;
}

/** Lỗi hydration của React xuất hiện dưới dạng pageerror có chữ "Hydration". */
export function hydrationErrors(errors: string[]) {
  return errors.filter((e) => /hydrat/i.test(e));
}

/** Chuyển sang một trong ba vai trò của demo. */
export async function switchRole(page: Page, role: "Người vay" | "Người cho vay" | "Đấu giá vốn") {
  await page
    .getByRole("button", { name: new RegExp(role) })
    .first()
    .click();
  await page.waitForTimeout(600);
}

/** Chọn một hồ sơ trong danh sách bên trái theo mã HS-xxxxxx. */
export async function selectLoan(page: Page, code: string) {
  await page.locator("aside button", { hasText: code }).first().click();
  await page.waitForTimeout(600);
}

/** Đọc 3 trường chính của form gửi đề xuất (vai người cho vay). */
export async function readOfferForm(page: Page) {
  return {
    rate: await page
      .getByLabel(/Lãi suất \/ năm/)
      .first()
      .inputValue(),
    amount: await page
      .getByLabel(/Số tiền tài trợ/)
      .first()
      .inputValue(),
    term: await page
      .getByLabel(/Kỳ hạn \(tháng\)/)
      .first()
      .inputValue(),
  };
}
