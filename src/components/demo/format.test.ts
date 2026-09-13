import { describe, expect, it } from "vitest";
import {
  formatCountdown,
  formatCountdownText,
  formatRate,
  formatVND,
  formatVNDFull,
} from "./format";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatVND", () => {
  it("dùng đơn vị 'tỷ' từ 1 tỷ trở lên, dấu phẩy làm dấu thập phân", () => {
    expect(formatVND(1_500_000_000)).toBe("1,5 tỷ ₫");
    expect(formatVND(2_300_000_000)).toBe("2,3 tỷ ₫");
  });

  it("bỏ phần thập phân khi số tỷ là số nguyên", () => {
    expect(formatVND(1_000_000_000)).toBe("1 tỷ ₫");
    expect(formatVND(3_000_000_000)).toBe("3 tỷ ₫");
  });

  it("dùng 'M' cho khoảng từ 1 triệu tới dưới 1 tỷ", () => {
    expect(formatVND(500_000_000)).toBe("500M ₫");
    expect(formatVND(1_000_000)).toBe("1M ₫");
    expect(formatVND(999_000_000)).toBe("999M ₫");
  });

  it("dưới 1 triệu thì nhóm chữ số theo locale vi-VN", () => {
    expect(formatVND(500_000)).toBe("500.000 ₫");
    expect(formatVND(0)).toBe("0 ₫");
  });

  it("chuyển đúng tại các mốc ranh giới", () => {
    expect(formatVND(999_999)).toBe("999.999 ₫");
    expect(formatVND(1_000_000)).toBe("1M ₫");
    expect(formatVND(999_999_999)).toBe("1000M ₫");
    expect(formatVND(1_000_000_000)).toBe("1 tỷ ₫");
  });
});

describe("formatVNDFull", () => {
  it("luôn hiện đầy đủ chữ số, không rút gọn", () => {
    expect(formatVNDFull(1_500_000_000)).toBe("1.500.000.000 ₫");
    expect(formatVNDFull(500_000_000)).toBe("500.000.000 ₫");
  });
});

describe("formatRate", () => {
  it("dùng dấu phẩy làm dấu thập phân theo cách viết tiếng Việt", () => {
    expect(formatRate(7.2)).toBe("7,2%/năm");
    expect(formatRate(9.95)).toBe("9,95%/năm");
  });

  it("số nguyên thì không thêm phần thập phân", () => {
    expect(formatRate(8)).toBe("8%/năm");
  });
});

describe("formatCountdown", () => {
  it("trả 00:00:00 khi đã hết giờ hoặc thời gian âm", () => {
    expect(formatCountdown(0)).toBe("00:00:00");
    expect(formatCountdown(-5000)).toBe("00:00:00");
  });

  it("dưới 1 ngày thì hiện HH:MM:SS có đệm số 0", () => {
    expect(formatCountdown(6 * HOUR)).toBe("06:00:00");
    expect(formatCountdown(1 * HOUR + 2 * MINUTE + 3 * SECOND)).toBe("01:02:03");
    expect(formatCountdown(59 * SECOND)).toBe("00:00:59");
  });

  it("từ 1 ngày trở lên thì thêm tiền tố số ngày", () => {
    expect(formatCountdown(DAY)).toBe("1n 00:00:00");
    expect(formatCountdown(2 * DAY + 6 * HOUR + 30 * MINUTE)).toBe("2n 06:30:00");
  });

  it("làm tròn xuống theo giây — đây chính là nguồn gốc lệch hydration", () => {
    // 6 giờ thiếu 1 mili-giây vẫn phải ra 05:59:59, không phải 06:00:00.
    expect(formatCountdown(6 * HOUR - 1)).toBe("05:59:59");
  });
});

describe("formatCountdownText", () => {
  it("báo phiên đã kết thúc khi hết giờ", () => {
    expect(formatCountdownText(0)).toBe("Phiên đã kết thúc");
    expect(formatCountdownText(-1)).toBe("Phiên đã kết thúc");
  });

  it("khi còn dưới 1 ngày thì nêu cả giờ và phút", () => {
    expect(formatCountdownText(2 * HOUR + 30 * MINUTE)).toBe("Còn khoảng 2 giờ 30 phút");
    expect(formatCountdownText(45 * MINUTE)).toBe("Còn khoảng 45 phút");
  });

  it("khi còn từ 1 ngày trở lên thì bỏ phần phút cho gọn", () => {
    expect(formatCountdownText(2 * DAY + 6 * HOUR + 30 * MINUTE)).toBe("Còn khoảng 2 ngày 6 giờ");
  });

  it("không bao giờ trả chuỗi rỗng khi còn dưới 1 phút", () => {
    expect(formatCountdownText(30 * SECOND)).toBe("Còn khoảng dưới 1 phút");
  });
});
