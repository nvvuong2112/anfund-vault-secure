import { expect, test } from "@playwright/test";
import { openLoanSheet, phone, switchRole, type Role } from "./helpers";

/**
 * Test hồi quy cho khổ điện thoại.
 *
 * Lỗi gốc: ảnh chụp thật trên iPhone cho thấy hình mờ logo phủ kín màn hình.
 * `DemoLayout` đặt ảnh rộng 34rem (544px) với `max-w-none`, thò ra phải 9rem —
 * trên desktop 1440px đó là vệt góc, trên 390px nó rộng hơn cả màn hình.
 *
 * Rà tiếp thì thấy thêm ba lỗi cùng loại "chỉ hiện ở khổ nhỏ": vùng chạm 30-36px,
 * tên bên cho vay bị bóp còn 85px, và một hình mờ thứ hai ở AuctionView.
 *
 * Bộ E2E còn lại chạy ở khổ mặc định nên không bắt được nhóm này.
 *
 * Từ khi demo thành ba "điện thoại": dưới 1280px chỉ một màn hình hiện, đổi vai
 * bằng thanh tab dưới đáy. Các phép thử dưới đây vì thế đi qua cả ba tab.
 */

const ROLES: Role[] = ["Người vay", "Đấu giá vốn", "Người cho vay"];

const PHONE = { width: 390, height: 844 }; // khổ logic của iPhone 14/15

test.use({ viewport: PHONE });

async function horizontallyScrolls(page: import("@playwright/test").Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
}

test.describe("Khổ điện thoại 390px", () => {
  // Một phép thử bắt cả một lớp lỗi: bất cứ thứ gì đẩy trang rộng ra đều lộ ở đây.
  for (const path of ["/", "/demo"]) {
    test(`${path} không cuộn ngang được`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      expect(await horizontallyScrolls(page)).toBe(false);

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      expect(await horizontallyScrolls(page)).toBe(false);
    });
  }

  test("hình mờ trang trí không phủ quá nửa màn hình", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });

    const widest = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      let max = 0;
      for (const img of document.querySelectorAll("img[aria-hidden]")) {
        const b = img.getBoundingClientRect();
        // Bao nhiêu phần của ảnh thực sự nằm trong màn hình
        max = Math.max(max, (Math.min(b.right, vw) - Math.max(b.left, 0)) / vw);
      }
      return max;
    });

    expect(widest).toBeLessThan(0.5);
  });

  test("nút bấm trong demo đạt vùng chạm tối thiểu 44px", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });

    const tooSmall = () =>
      page.evaluate(() =>
        [...document.querySelectorAll("button")]
          .filter((el) => {
            const b = el.getBoundingClientRect();
            return b.height > 0 && b.height < 44;
          })
          .map(
            (el) =>
              `${el.textContent?.trim().slice(0, 30)} (${Math.round(el.getBoundingClientRect().height)}px)`,
          ),
      );

    for (const role of ROLES) {
      await switchRole(page, role);
      expect(await tooSmall(), role).toEqual([]);
    }
    // Bảng đặt giá của bên cho vay có nút −/+ riêng.
    await openLoanSheet(page, "HS-002389");
    expect(await tooSmall(), "bảng đặt giá").toEqual([]);
  });

  test("mỗi lúc chỉ một màn hình, thanh tab đổi được cả ba", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });

    for (const role of ROLES) {
      await switchRole(page, role);
      for (const other of ROLES) {
        if (other === role) await expect(phone(page, other)).toBeVisible();
        else await expect(phone(page, other)).toBeHidden();
      }
    }
  });

  test("màn hình vừa khít giữa header và thanh tab, không cuộn cả trang", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });

    for (const role of ROLES) {
      await switchRole(page, role);
      const scrolls = await page.evaluate(
        () => document.documentElement.scrollHeight > document.documentElement.clientHeight,
      );
      expect(scrolls, role).toBe(false);
    }
    // Thanh tab luôn nằm trong màn hình, không bị đẩy xuống dưới.
    const nav = await page.getByRole("navigation", { name: "Chọn vai" }).boundingBox();
    expect(nav!.y + nav!.height).toBeLessThanOrEqual(844);
  });

  test("bấm 'Tôi muốn cho vay' chuyển sang tab người cho vay", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await phone(page, "Người vay").getByRole("button", { name: "Tôi muốn cho vay" }).click();
    await expect(phone(page, "Người cho vay")).toBeVisible();
    await expect(phone(page, "Người vay")).toBeHidden();
  });

  test("tên bên cho vay hiện đủ, không bị cắt cụt", async ({ page }) => {
    await page.goto("/demo", { waitUntil: "networkidle" });
    await switchRole(page, "Đấu giá vốn");

    // "Quỹ đầu tư An Tín" là tên dài nhất trong seed.ts — nó vừa thì cả bốn đều vừa.
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll("span")]
        .filter((el) => {
          if (el.children.length) return false;
          const t = el.textContent?.trim() ?? "";
          if (!/An Tín|Capital Partner|Việt Hưng|Mr\. Lê/.test(t)) return false;
          return el.scrollWidth > el.clientWidth + 1;
        })
        .map((el) => el.textContent?.trim()),
    );

    expect(clipped).toEqual([]);
  });
});
