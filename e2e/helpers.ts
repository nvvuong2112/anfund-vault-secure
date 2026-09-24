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

export type Role = "Người vay" | "Đấu giá vốn" | "Người cho vay";

/**
 * Một "điện thoại" trong demo. Mỗi máy là một <section aria-label="…">.
 * Ở khổ máy tính (≥1280px) cả ba máy cùng hiện; dưới đó chỉ máy đang chọn hiện.
 */
export function phone(page: Page, role: Role) {
  return page.getByRole("region", { name: role, exact: true });
}

/**
 * Chuyển sang một vai. Dưới 1280px là bấm thanh tab dưới đáy; ở khổ máy tính
 * thanh tab bị ẩn vì cả ba máy đã hiện sẵn, nên không cần làm gì.
 */
export async function switchRole(page: Page, role: Role) {
  const tab = page.getByRole("navigation", { name: "Chọn vai" }).getByRole("button", {
    name: role,
    exact: true,
  });
  if (await tab.isVisible()) await tab.click();
  return phone(page, role);
}

/** Vai người cho vay: bấm thẻ hồ sơ theo mã HS-xxxxxx để mở bảng đặt giá. */
export async function openLoanSheet(page: Page, code: string) {
  const lender = await switchRole(page, "Người cho vay");
  await lender.locator("aside button", { hasText: code }).first().click();
  await lender.getByRole("dialog").waitFor();
}

/** Đóng bảng đặt giá đang mở. */
export async function closeLoanSheet(page: Page) {
  const dialog = phone(page, "Người cho vay").getByRole("dialog");
  await dialog
    .getByRole("button", { name: /^(Xong|Đóng)$/ })
    .first()
    .click();
  await dialog.waitFor({ state: "detached" });
}

/** Đọc 3 trường chính của bảng đặt giá (vai người cho vay). */
export async function readOfferForm(page: Page) {
  const dialog = phone(page, "Người cho vay").getByRole("dialog");
  return {
    rate: await dialog.getByLabel(/Lãi suất \/ năm/).inputValue(),
    amount: await dialog.getByLabel(/Số tiền tài trợ/).inputValue(),
    term: await dialog.getByLabel(/Kỳ hạn \(tháng\)/).inputValue(),
  };
}

/** Vai người vay: đi hết ba câu hỏi + màn xác minh để mở một phiên mới. */
export async function createBorrowerLoan(page: Page) {
  const borrower = await switchRole(page, "Người vay");
  await borrower.getByRole("button", { name: "Tôi cần vay vốn" }).click();
  await borrower.getByRole("button", { name: "500M", exact: true }).click();
  await borrower.getByRole("button", { name: "120 tháng", exact: true }).click();
  await borrower.getByRole("button", { name: "Mua nhà ở", exact: true }).click();
  await borrower.getByRole("button", { name: "Gửi hồ sơ xác minh" }).click();
  await borrower.getByRole("button", { name: "Mở phiên đấu giá vốn" }).click();
  return borrower;
}
