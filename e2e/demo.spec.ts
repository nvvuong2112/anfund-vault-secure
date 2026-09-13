import { expect, test } from "@playwright/test";
import {
  collectPageErrors,
  hydrationErrors,
  readOfferForm,
  selectLoan,
  switchRole,
} from "./helpers";

// Ba hồ sơ mẫu, số tiền và kỳ hạn khác hẳn nhau — chính sự khác biệt này để lộ
// lỗi form giữ nguyên giá trị của hồ sơ trước.
const LOAN_A = { code: "HS-002389", amount: "500000000", term: "120" };
const LOAN_B = { code: "HS-002417", amount: "1500000000", term: "36" };
const LOAN_C = { code: "HS-002442", amount: "200000000", term: "36" };

test.describe("/demo — tải trang", () => {
  test("tải trực tiếp và refresh đều không có lỗi", async ({ page }) => {
    const errors = collectPageErrors(page);

    await page.goto("/demo", { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: /Người vay/ }).first()).toBeVisible();

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: /Người vay/ }).first()).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("đổi qua lại cả ba vai trò không sinh lỗi", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto("/demo", { waitUntil: "networkidle" });

    await switchRole(page, "Người cho vay");
    await switchRole(page, "Đấu giá vốn");
    await switchRole(page, "Người vay");

    expect(errors).toEqual([]);
  });

  // Đồng hồ đếm ngược từng làm server và client lệch nhau 1 giây, khiến React
  // dựng lại toàn bộ cây. Lỗi CHỈ xuất hiện khoảng 25% số lần tải, nên phải
  // lặp nhiều lần mới đủ tin cậy. Bản vá: suppressHydrationWarning ở Countdown.
  test("không lệch hydration qua nhiều lần tải", async ({ browser }) => {
    const RUNS = 8;
    const found: string[] = [];

    for (let i = 0; i < RUNS; i++) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      const errors = collectPageErrors(page);
      await page.goto("/demo", { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);
      found.push(...hydrationErrors(errors));
      await ctx.close();
    }

    expect(found).toEqual([]);
  });
});

test.describe("Vai người cho vay — form gửi đề xuất", () => {
  // Hồi quy: LoanInspector từng render không có `key`, nên React tái dùng
  // instance cũ và form giữ nguyên số tiền/kỳ hạn của hồ sơ trước. Người cho
  // vay sẽ vô tình chào 500 triệu cho hồ sơ cần 1,5 tỷ.
  test("form cập nhật theo đúng hồ sơ đang chọn", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await switchRole(page, "Người cho vay");

    await selectLoan(page, LOAN_A.code);
    const a = await readOfferForm(page);
    expect(a.amount).toBe(LOAN_A.amount);
    expect(a.term).toBe(LOAN_A.term);

    await selectLoan(page, LOAN_B.code);
    const b = await readOfferForm(page);
    expect(b.amount).toBe(LOAN_B.amount);
    expect(b.term).toBe(LOAN_B.term);

    await selectLoan(page, LOAN_C.code);
    const c = await readOfferForm(page);
    expect(c.amount).toBe(LOAN_C.amount);
    expect(c.term).toBe(LOAN_C.term);

    // Quay lại A phải khôi phục đúng giá trị của A.
    await selectLoan(page, LOAN_A.code);
    expect(await readOfferForm(page)).toEqual(a);
  });

  test("lãi suất gợi ý luôn thấp hơn mức tốt nhất hiện có", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await switchRole(page, "Người cho vay");
    await selectLoan(page, LOAN_A.code);

    const { rate } = await readOfferForm(page);
    // Hồ sơ A đang có đề xuất tốt nhất 7,2% → gợi ý phải là 7,0%.
    expect(Number(rate)).toBeLessThan(7.2);
    expect(Number(rate)).toBeGreaterThanOrEqual(6.5);
  });

  // Hồi quy cùng nguyên nhân với lỗi trên: state `submitted` cũng sống sót qua
  // lần đổi hồ sơ, làm người dùng tưởng đã chào hồ sơ mới.
  test("thẻ xác nhận không dính sang hồ sơ khác", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await switchRole(page, "Người cho vay");
    await selectLoan(page, LOAN_B.code);

    await page
      .getByRole("button", { name: /Gửi đề xuất/ })
      .first()
      .click();
    await expect(page.getByText(/Đã gửi đề xuất|đề xuất của bạn/i).first()).toBeVisible();

    await selectLoan(page, LOAN_A.code);
    await expect(page.getByText(/Đã gửi đề xuất|đề xuất của bạn/i)).toHaveCount(0);
    // Và form phải trở lại đúng giá trị của hồ sơ A.
    expect((await readOfferForm(page)).amount).toBe(LOAN_A.amount);
  });
});

test.describe("Vai người vay — vòng đời hồ sơ", () => {
  test("tạo hồ sơ, nhận đề xuất tự động, chọn một đề xuất", async ({ page }) => {
    test.setTimeout(90_000);
    const errors = collectPageErrors(page);
    await page.goto("/demo", { waitUntil: "networkidle" });

    await page
      .getByRole("button", { name: /^Tạo hồ sơ$/ })
      .first()
      .click();
    await page.getByRole("button", { name: /Mở phiên đấu giá vốn/ }).click();

    await expect(page.getByText(/HS-DEMO-\d+/).first()).toBeVisible();
    await expect(page.getByText(/Bạn \(demo\)/).first()).toBeVisible();

    // store hẹn 2–4 đề xuất tự động trong khoảng 2,5s–14s.
    const accept = page.getByRole("button", { name: /Chọn phương án này/ });
    await expect(accept.first()).toBeVisible({ timeout: 25_000 });

    await accept.first().click();
    await expect(page.getByText(/Đã khớp/).first()).toBeVisible();
    // Khớp xong thì không còn chọn được đề xuất nào nữa.
    await expect(accept).toHaveCount(0);

    expect(errors).toEqual([]);
  });
});

test.describe("Vòng đời phiên đấu giá", () => {
  // Phiên ngắn nhất là 8 tiếng nên không chờ thật được — tua đồng hồ.
  test("phiên chuyển sang đã đóng khi hết giờ", async ({ page }) => {
    await page.clock.install();
    await page.goto("/demo", { waitUntil: "networkidle" });

    await expect(page.getByText("Đang mở").first()).toBeVisible();
    await expect(page.getByText("Đã đóng")).toHaveCount(0);

    // Hồ sơ mẫu đầu tiên kết thúc sau 6 giờ.
    await page.clock.fastForward("07:00:00");
    await expect(page.getByText("Đã đóng").first()).toBeVisible();

    // Tua tiếp cho mọi phiên hết hạn.
    await page.clock.fastForward("48:00:00");
    await expect(page.getByText("Đang mở")).toHaveCount(0);
  });
});

test.describe("Đặt lại demo", () => {
  test("dọn sạch hẹn giờ cũ, không có đề xuất 'ma' chui vào sau khi reset", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/demo", { waitUntil: "networkidle" });

    // Tạo hồ sơ để kích hoạt hẹn giờ đề xuất tự động, rồi reset ngay lập tức.
    await page
      .getByRole("button", { name: /^Tạo hồ sơ$/ })
      .first()
      .click();
    await page.getByRole("button", { name: /Mở phiên đấu giá vốn/ }).click();
    await page.getByRole("button", { name: /Đặt lại demo/ }).click();

    const header = page.locator("header");
    await expect(header).toContainText("3 hồ sơ");
    const after = (await header.innerText()).match(/(\d+) hồ sơ · (\d+) đề xuất/);
    expect(after).not.toBeNull();

    // Chờ quá khung 14s của hẹn giờ cũ — số liệu phải đứng yên.
    await page.waitForTimeout(18_000);
    const later = (await header.innerText()).match(/(\d+) hồ sơ · (\d+) đề xuất/);
    expect(later?.[2]).toBe(after?.[2]);
  });

  test("đồng hồ đếm ngược vẫn chạy sau khi reset", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Đặt lại demo/ }).click();

    const read = async () =>
      (await page.locator("body").innerText()).match(/\b\d{2}:\d{2}:\d{2}\b/)?.[0];
    const first = await read();
    await page.waitForTimeout(3000);
    const second = await read();

    expect(first).toBeTruthy();
    expect(second).not.toBe(first);
  });
});
