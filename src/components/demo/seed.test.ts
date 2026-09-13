import { describe, expect, it } from "vitest";
import { buildSeedLoans, generateAutoOffer, makeId } from "./seed";
import { MIN_AUCTION_HOURS, VERIFICATION_DAYS } from "./types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

describe("hằng số nghiệp vụ", () => {
  // Hai con số này được nhắc lại ở 5 section marketing. Đổi ở đây mà quên đổi
  // nội dung trang là mâu thuẫn với điều đang quảng bá với người dùng.
  it("giữ đúng quy tắc đã công bố: phiên tối thiểu 8 giờ, xác minh 5 ngày", () => {
    expect(MIN_AUCTION_HOURS).toBe(8);
    expect(VERIFICATION_DAYS).toBe(5);
  });
});

describe("buildSeedLoans", () => {
  const loans = buildSeedLoans();

  it("dựng đủ 3 hồ sơ mẫu, tất cả đang mở", () => {
    expect(loans).toHaveLength(3);
    expect(loans.every((l) => l.status === "open")).toBe(true);
  });

  it("mọi hồ sơ đều đã xác minh trước khi mở phiên", () => {
    for (const loan of loans) {
      expect(loan.verifiedAt).toBeGreaterThan(loan.submittedAt);
      expect(loan.verifiedAt).toBeLessThanOrEqual(Date.now());
    }
  });

  it("mọi hồ sơ tôn trọng quy tắc nộp trước 5 ngày", () => {
    for (const loan of loans) {
      const daysAhead = (loan.verifiedAt - loan.submittedAt) / DAY;
      expect(daysAhead).toBeGreaterThanOrEqual(VERIFICATION_DAYS);
    }
  });

  it("mọi phiên đấu giá dài tối thiểu 8 giờ", () => {
    for (const loan of loans) {
      const hours = (loan.auctionEndsAt - loan.createdAt) / HOUR;
      expect(hours).toBeGreaterThanOrEqual(MIN_AUCTION_HOURS);
    }
  });

  it("mọi đề xuất đều trỏ đúng về hồ sơ chứa nó", () => {
    for (const loan of loans) {
      for (const offer of loan.offers) {
        expect(offer.loanId).toBe(loan.id);
      }
    }
  });

  it("không đề xuất nào tài trợ vượt số tiền được yêu cầu", () => {
    for (const loan of loans) {
      for (const offer of loan.offers) {
        expect(offer.amount).toBeLessThanOrEqual(loan.amount);
      }
    }
  });

  it("mã hồ sơ là duy nhất giữa các lần dựng lại", () => {
    const again = buildSeedLoans();
    const ids = [...loans, ...again].map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("generateAutoOffer", () => {
  // Hàm này dùng Math.random nên kiểm theo bất biến, chạy nhiều lần.
  const RUNS = 300;
  const REQUEST = 500_000_000;

  it("không bao giờ chào dưới mức sàn 6,5%", () => {
    for (let i = 0; i < RUNS; i++) {
      // baseRate thấp bất thường để ép chạm sàn
      const offer = generateAutoOffer("loan-1", 5, REQUEST);
      expect(offer.rate).toBeGreaterThanOrEqual(6.5);
    }
  });

  it("lãi suất luôn làm tròn tới 1 chữ số thập phân", () => {
    for (let i = 0; i < RUNS; i++) {
      const offer = generateAutoOffer("loan-1", 8.8, REQUEST);
      expect(Math.round(offer.rate * 10)).toBeCloseTo(offer.rate * 10, 10);
    }
  });

  it("không bao giờ tài trợ vượt số tiền yêu cầu", () => {
    for (let i = 0; i < RUNS; i++) {
      const offer = generateAutoOffer("loan-1", 8.8, REQUEST);
      expect(offer.amount).toBeLessThanOrEqual(REQUEST);
      expect(offer.amount).toBeGreaterThan(0);
    }
  });

  it("fitScore luôn nằm trong 60–95", () => {
    for (let i = 0; i < RUNS; i++) {
      const offer = generateAutoOffer("loan-1", 8.8, REQUEST);
      expect(offer.fitScore).toBeGreaterThanOrEqual(60);
      expect(offer.fitScore).toBeLessThanOrEqual(95);
    }
  });

  it("trả term = 0 làm giá trị lính canh — store phải vá lại bằng `|| term`", () => {
    // Ghi lại chủ ý này để ai đổi hàm còn biết store.tsx đang dựa vào nó.
    expect(generateAutoOffer("loan-1", 8.8, REQUEST).term).toBe(0);
  });

  it("luôn ở trạng thái chờ và gắn đúng loanId", () => {
    const offer = generateAutoOffer("loan-xyz", 8.8, REQUEST);
    expect(offer.status).toBe("pending");
    expect(offer.loanId).toBe("loan-xyz");
  });

  it("bên cho vay luôn đã được xác minh từ trước", () => {
    const offer = generateAutoOffer("loan-1", 8.8, REQUEST);
    expect(offer.lenderVerifiedAt).toBeLessThan(Date.now());
  });
});

describe("makeId", () => {
  it("sinh mã duy nhất cho cùng một tiền tố", () => {
    const ids = Array.from({ length: 100 }, () => makeId("off"));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("off-"))).toBe(true);
  });
});
