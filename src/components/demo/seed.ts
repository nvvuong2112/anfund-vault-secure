import type { Loan, Offer } from "./types";

const NOW = () => Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

let counter = 1;
const id = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${counter++}`;

export function buildSeedLoans(): Loan[] {
  const t = NOW();

  const loan1: Loan = {
    id: id("loan"),
    code: "HS-002389",
    borrowerName: "Nguyễn Minh A.",
    amount: 500_000_000,
    term: 120,
    purpose: "Mua nhà ở",
    monthlyIncome: 35_000_000,
    history: "Tốt · CIC nhóm 1 · 2 khoản đã tất toán",
    collateral: "BĐS Q.7, định giá 1,2 tỷ",
    riskLevel: "low",
    submittedAt: t - 12 * DAY,
    verifiedAt: t - 6 * DAY,
    auctionEndsAt: t + 6 * HOUR,
    status: "open",
    offers: [],
    createdAt: t - 18 * HOUR,
  };

  const offers1: Offer[] = [
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Quỹ đầu tư An Tín",
      lenderType: "fund",
      lenderVerifiedAt: t - 60 * DAY,
      rate: 7.2,
      amount: 500_000_000,
      term: 120,
      conditions: "Cố định 12 tháng đầu, giải ngân 24h",
      collateralRequirement: "BĐS thế chấp",
      fitScore: 92,
      createdAt: t - 12 * HOUR,
      status: "pending",
    },
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Capital Partner V",
      lenderType: "fund",
      lenderVerifiedAt: t - 45 * DAY,
      rate: 7.5,
      amount: 500_000_000,
      term: 120,
      conditions: "Cố định 6 tháng đầu, giải ngân 48h",
      collateralRequirement: "BĐS thế chấp",
      fitScore: 88,
      createdAt: t - 8 * HOUR,
      status: "pending",
    },
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Việt Hưng Capital",
      lenderType: "company",
      lenderVerifiedAt: t - 30 * DAY,
      rate: 8.0,
      amount: 500_000_000,
      term: 84,
      conditions: "Thả nổi sau 6 tháng, giải ngân 24h",
      collateralRequirement: "BĐS thế chấp",
      fitScore: 81,
      createdAt: t - 4 * HOUR,
      status: "pending",
    },
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Mr. Lê (Cá nhân)",
      lenderType: "individual",
      lenderVerifiedAt: t - 21 * DAY,
      rate: 7.8,
      amount: 300_000_000,
      term: 60,
      conditions: "Tín chấp một phần, giải ngân 72h",
      collateralRequirement: "Đồng ký",
      fitScore: 75,
      createdAt: t - 90 * MIN,
      status: "pending",
    },
  ];

  loan1.offers = offers1;

  const loan2: Loan = {
    id: id("loan"),
    code: "HS-002417",
    borrowerName: "CTY TNHH Hưng Phát",
    amount: 1_500_000_000,
    term: 36,
    purpose: "Bổ sung vốn lưu động sản xuất",
    monthlyIncome: 220_000_000,
    history: "Doanh thu 24 tỷ/năm · CIC tổ chức nhóm 1",
    collateral: "Hàng tồn kho + BĐS xưởng",
    riskLevel: "medium",
    submittedAt: t - 18 * DAY,
    verifiedAt: t - 9 * DAY,
    auctionEndsAt: t + 2 * DAY + 6 * HOUR,
    status: "open",
    offers: [
      {
        id: id("off"),
        loanId: "tmp",
        lenderName: "MeKong Growth Fund",
        lenderType: "fund",
        lenderVerifiedAt: t - 90 * DAY,
        rate: 9.5,
        amount: 1_500_000_000,
        term: 36,
        conditions: "Giải ngân theo tiến độ, kiểm soát dòng tiền",
        collateralRequirement: "BĐS xưởng",
        fitScore: 84,
        createdAt: t - 18 * HOUR,
        status: "pending",
      },
      {
        id: id("off"),
        loanId: "tmp",
        lenderName: "Nam Sài Gòn Invest",
        lenderType: "company",
        lenderVerifiedAt: t - 75 * DAY,
        rate: 9.9,
        amount: 1_200_000_000,
        term: 24,
        conditions: "Giải ngân 1 lần, báo cáo dòng tiền hàng quý",
        collateralRequirement: "BĐS xưởng",
        fitScore: 78,
        createdAt: t - 8 * HOUR,
        status: "pending",
      },
    ],
    createdAt: t - 1 * DAY - 12 * HOUR,
  };
  loan2.offers = loan2.offers.map((o) => ({ ...o, loanId: loan2.id }));

  const loan3: Loan = {
    id: id("loan"),
    code: "HS-002442",
    borrowerName: "Trần Thị B.",
    amount: 200_000_000,
    term: 36,
    purpose: "Học thạc sĩ MBA",
    monthlyIncome: 28_000_000,
    history: "Tốt · CIC nhóm 1 · không có khoản vay đang trả",
    collateral: "Tín chấp + đồng ký",
    riskLevel: "medium",
    submittedAt: t - 11 * DAY,
    verifiedAt: t - 5 * DAY,
    auctionEndsAt: t + 1 * DAY + 4 * HOUR,
    status: "open",
    offers: [
      {
        id: id("off"),
        loanId: "tmp",
        lenderName: "EduFund VN",
        lenderType: "fund",
        lenderVerifiedAt: t - 50 * DAY,
        rate: 8.5,
        amount: 200_000_000,
        term: 36,
        conditions: "Ân hạn gốc 12 tháng, giải ngân theo học kỳ",
        collateralRequirement: "Đồng ký",
        fitScore: 86,
        createdAt: t - 14 * HOUR,
        status: "pending",
      },
    ],
    createdAt: t - 20 * HOUR,
  };
  loan3.offers = loan3.offers.map((o) => ({ ...o, loanId: loan3.id }));

  return [loan1, loan2, loan3];
}

const FAKE_LENDERS = [
  { name: "Quỹ đầu tư An Tín", type: "fund" as const, verifiedDaysAgo: 60 },
  { name: "Capital Partner V", type: "fund" as const, verifiedDaysAgo: 45 },
  { name: "MeKong Growth Fund", type: "fund" as const, verifiedDaysAgo: 90 },
  { name: "Nam Sài Gòn Invest", type: "company" as const, verifiedDaysAgo: 75 },
  { name: "Việt Hưng Capital", type: "company" as const, verifiedDaysAgo: 30 },
  { name: "EduFund VN", type: "fund" as const, verifiedDaysAgo: 50 },
  { name: "Mr. Lê (Cá nhân)", type: "individual" as const, verifiedDaysAgo: 21 },
  { name: "Bà Trần (Cá nhân)", type: "individual" as const, verifiedDaysAgo: 14 },
  { name: "Tín Phát Holdings", type: "company" as const, verifiedDaysAgo: 38 },
];

export function generateAutoOffer(
  loanId: string,
  baseRate: number,
  requestAmount: number,
): Omit<Offer, "id"> {
  const lender = FAKE_LENDERS[Math.floor(Math.random() * FAKE_LENDERS.length)];
  const variance = (Math.random() - 0.3) * 1.4;
  const rate = Math.max(6.5, Math.round((baseRate + variance) * 10) / 10);
  const amount =
    Math.random() < 0.7
      ? requestAmount
      : Math.round((requestAmount * (0.6 + Math.random() * 0.4)) / 1_000_000) * 1_000_000;
  const fitScore = Math.round(60 + Math.random() * 35);
  const conditionPool = [
    "Cố định 12 tháng đầu, giải ngân 24h",
    "Cố định 6 tháng đầu, giải ngân 48h",
    "Thả nổi sau 6 tháng, giải ngân 24h",
    "Giải ngân theo tiến độ, kiểm soát dòng tiền",
    "Tín chấp một phần, giải ngân 72h",
  ];
  const collateralPool = ["BĐS thế chấp", "Đồng ký", "Hàng tồn kho", "BĐS xưởng"];
  return {
    loanId,
    lenderName: lender.name,
    lenderType: lender.type,
    lenderVerifiedAt: Date.now() - lender.verifiedDaysAgo * DAY,
    rate,
    amount,
    term: 0,
    conditions: conditionPool[Math.floor(Math.random() * conditionPool.length)],
    collateralRequirement: collateralPool[Math.floor(Math.random() * collateralPool.length)],
    fitScore,
    createdAt: Date.now(),
    status: "pending",
  };
}

export function makeId(prefix: string) {
  return id(prefix);
}
