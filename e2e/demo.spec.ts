import { expect, test } from "@playwright/test";
import {
  closeLoanSheet,
  collectPageErrors,
  createBorrowerLoan,
  hydrationErrors,
  openLoanSheet,
  phone,
  readOfferForm,
} from "./helpers";

// Bộ này chạy ở khổ máy tính mặc định (1280px): cả ba điện thoại cùng hiện.
// Hành vi riêng của khổ điện thoại nằm ở mobile.spec.ts.

// Ba hồ sơ mẫu, số tiền và kỳ hạn khác hẳn nhau — chính sự khác biệt này để lộ
// lỗi form giữ nguyên giá trị của hồ sơ trước.
const LOAN_A = { code: "HS-002389", amount: "500000000", term: "120" };
const LOAN_B = { code: "HS-002417", amount: "1500000000", term: "36" };
const LOAN_C = { code: "HS-002442", amount: "200000000", term: "36" };

test.describe("/demo — tải trang", () => {
  test("tải trực tiếp và refresh đều không có lỗi", async ({ page }) => {
    const errors = collectPageErrors(page);

    await page.goto("/demo", { waitUntil: "networkidle" });
    await expect(phone(page, "Người vay")).toBeVisible();

    await page.reload({ waitUntil: "networkidle" });
    await expect(phone(page, "Người vay")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("khổ máy tính hiện cả ba điện thoại, không cần thanh tab", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });

    await expect(phone(page, "Người vay")).toBeVisible();
    await expect(phone(page, "Đấu giá vốn")).toBeVisible();
    await expect(phone(page, "Người cho vay")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Chọn vai" })).toBeHidden();
  });

  // Đồng hồ đếm ngược từng làm server và client lệch nhau 1 giây, khiến React
  // dựng lại toàn bộ cây. Lỗi CHỈ xuất hiện khoảng 25% số lần tải, nên phải
  // lặp nhiều lần mới đủ tin cậy. Bản vá: suppressHydrationWarning ở Countdown.
  // Giờ cả ba màn hình cùng render trên server (kể cả thanh tiến trình phiên
  // suy ra từ giờ hiện tại), nên bề mặt dễ lệch còn lớn hơn trước.
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

test.describe("Vai người cho vay — bảng đặt giá", () => {
  // Hồi quy: form đặt giá từng render không có `key`, nên React tái dùng
  // instance cũ và form giữ nguyên số tiền/kỳ hạn của hồ sơ trước. Người cho
  // vay sẽ vô tình chào 500 triệu cho hồ sơ cần 1,5 tỷ.
  test("form cập nhật theo đúng hồ sơ đang chọn", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });

    await openLoanSheet(page, LOAN_A.code);
    const a = await readOfferForm(page);
    expect(a.amount).toBe(LOAN_A.amount);
    expect(a.term).toBe(LOAN_A.term);
    await closeLoanSheet(page);

    await openLoanSheet(page, LOAN_B.code);
    const b = await readOfferForm(page);
    expect(b.amount).toBe(LOAN_B.amount);
    expect(b.term).toBe(LOAN_B.term);
    await closeLoanSheet(page);

    await openLoanSheet(page, LOAN_C.code);
    const c = await readOfferForm(page);
    expect(c.amount).toBe(LOAN_C.amount);
    expect(c.term).toBe(LOAN_C.term);
    await closeLoanSheet(page);

    // Quay lại A phải khôi phục đúng giá trị của A.
    await openLoanSheet(page, LOAN_A.code);
    expect(await readOfferForm(page)).toEqual(a);
  });

  test("lãi suất gợi ý luôn thấp hơn mức tốt nhất hiện có", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await openLoanSheet(page, LOAN_A.code);

    const { rate } = await readOfferForm(page);
    // Hồ sơ A đang có đề xuất tốt nhất 7,2% → gợi ý phải là 7,0%.
    expect(Number(rate)).toBeLessThan(7.2);
    expect(Number(rate)).toBeGreaterThanOrEqual(6.5);
  });

  // Hồi quy cùng nguyên nhân với lỗi trên: state "đã gửi" cũng sống sót qua
  // lần đổi hồ sơ, làm người dùng tưởng đã chào hồ sơ mới.
  test("thẻ xác nhận không dính sang hồ sơ khác", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    const lender = phone(page, "Người cho vay");

    await openLoanSheet(page, LOAN_B.code);
    await lender.getByRole("button", { name: "Gửi đề xuất" }).click();
    await expect(lender.getByText(/Đã gửi đề xuất/)).toBeVisible();
    await closeLoanSheet(page);

    await openLoanSheet(page, LOAN_A.code);
    await expect(lender.getByText(/Đã gửi đề xuất/)).toHaveCount(0);
    // Và form phải trở lại đúng giá trị của hồ sơ A.
    expect((await readOfferForm(page)).amount).toBe(LOAN_A.amount);
  });

  test("nút −/+ chỉnh lãi suất từng 0,1 điểm và báo có dẫn đầu hay không", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    const dialog = phone(page, "Người cho vay").getByRole("dialog");

    await openLoanSheet(page, LOAN_A.code); // dẫn đầu 7,2%, gợi ý 7,0%
    await expect(dialog.getByText(/Bạn sẽ dẫn đầu/)).toBeVisible();

    for (let i = 0; i < 3; i++) await dialog.getByRole("button", { name: /Tăng 0,1/ }).click();
    expect(Number((await readOfferForm(page)).rate)).toBeCloseTo(7.3);
    await expect(dialog.getByText(/Chưa dẫn đầu/)).toBeVisible();
  });
});

test.describe("Vai người vay — vòng đời hồ sơ", () => {
  test("ba câu hỏi, mở phiên, nhận đề xuất tự động, chọn một đề xuất", async ({ page }) => {
    test.setTimeout(90_000);
    const errors = collectPageErrors(page);
    await page.goto("/demo", { waitUntil: "networkidle" });

    const borrower = phone(page, "Người vay");
    // Chưa chọn đủ ba mục thì không đi tiếp được.
    await borrower.getByRole("button", { name: "Tôi cần vay vốn" }).click();
    await expect(borrower.getByRole("button", { name: "Gửi hồ sơ xác minh" })).toBeDisabled();
    await borrower.getByRole("button", { name: "Quay lại" }).click();

    await createBorrowerLoan(page);
    await expect(borrower.getByText(/HS-DEMO-\d+/).first()).toBeVisible();
    await expect(borrower.getByText(/Bạn \(demo\)/).first()).toBeVisible();

    // store hẹn 2–4 đề xuất tự động trong khoảng 2,5s–14s.
    const accept = borrower.getByRole("button", { name: /Chọn phương án này/ });
    await expect(accept).toBeVisible({ timeout: 25_000 });

    await accept.click();
    await expect(borrower.getByText(/Đã khớp/).first()).toBeVisible();
    // Khớp xong thì không còn chọn được đề xuất nào nữa.
    await expect(accept).toHaveCount(0);

    expect(errors).toEqual([]);
  });
});

test.describe("Ba máy chung một phiên", () => {
  test("người vay mở phiên → sàn đấu giá và bên cho vay thấy ngay", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    const borrower = await createBorrowerLoan(page);

    const code = (
      await borrower
        .getByText(/HS-DEMO-\d+/)
        .first()
        .innerText()
    ).match(/HS-DEMO-\d+/)![0];

    // Máy đấu giá tự chuyển sang phiên vừa mở.
    const auction = phone(page, "Đấu giá vốn");
    await expect(auction.getByRole("button", { name: code })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Máy cho vay có thẻ hồ sơ mới trong danh sách.
    await expect(
      phone(page, "Người cho vay").locator("aside button", { hasText: code }),
    ).toHaveCount(1);
  });

  test("bên cho vay đặt giá → người vay và sàn thấy đề xuất mới dẫn đầu", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    const borrower = phone(page, "Người vay");
    // Người vay xem phiên mẫu HS-002389 (dẫn đầu 7,2%).
    await borrower.getByRole("button", { name: /Xem phiên này/ }).click();

    await openLoanSheet(page, LOAN_A.code);
    const dialog = phone(page, "Người cho vay").getByRole("dialog");
    await dialog.getByLabel(/Tên hiển thị/).fill("Quỹ Thử Nghiệm E2E");
    await dialog.getByRole("button", { name: "Gửi đề xuất" }).click();
    await closeLoanSheet(page);

    // Gợi ý 7,0% < 7,2% → đề xuất mới đứng đầu ở cả hai máy.
    const firstOffer = borrower.getByRole("listitem").first();
    await expect(firstOffer).toContainText("Quỹ Thử Nghiệm E2E");
    await expect(firstOffer).toContainText("7%");
    await expect(
      phone(page, "Đấu giá vốn").getByRole("list").first().getByRole("listitem").first(),
    ).toContainText("Quỹ Thử Nghiệm E2E");
  });
});

test.describe("Vòng đời phiên đấu giá", () => {
  // Phiên ngắn nhất là 8 tiếng nên không chờ thật được — tua đồng hồ.
  test("phiên chuyển sang đã đóng khi hết giờ", async ({ page }) => {
    await page.clock.install();
    await page.goto("/demo", { waitUntil: "networkidle" });
    // `exact`: chỉ bắt nhãn trạng thái, không bắt câu kiểu "0 hồ sơ … đang mở phiên".

    await expect(page.getByText("Đang mở", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Đã đóng", { exact: true })).toHaveCount(0);

    // Hồ sơ mẫu đầu tiên kết thúc sau 6 giờ.
    await page.clock.fastForward("07:00:00");
    await expect(page.getByText("Đã đóng", { exact: true }).first()).toBeVisible();

    // Tua tiếp cho mọi phiên hết hạn.
    await page.clock.fastForward("48:00:00");
    await expect(page.getByText("Đang mở", { exact: true })).toHaveCount(0);
    // Bên cho vay không còn hồ sơ nào để đặt giá.
    await expect(phone(page, "Người cho vay").locator("aside button")).toHaveCount(0);
  });
});

test.describe("Đặt lại demo", () => {
  test("dọn sạch hẹn giờ cũ, không có đề xuất 'ma' chui vào sau khi reset", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/demo", { waitUntil: "networkidle" });

    // Tạo hồ sơ để kích hoạt hẹn giờ đề xuất tự động, rồi reset ngay lập tức.
    await createBorrowerLoan(page);
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

  test("người vay đang xem phiên thì quay về màn hình đầu sau khi reset", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    const borrower = await createBorrowerLoan(page);
    await expect(borrower.getByText(/HS-DEMO-\d+/).first()).toBeVisible();

    await page.getByRole("button", { name: /Đặt lại demo/ }).click();
    await expect(borrower.getByRole("button", { name: "Tôi cần vay vốn" })).toBeVisible();
    await expect(page.getByText(/HS-DEMO-\d+/)).toHaveCount(0);
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
