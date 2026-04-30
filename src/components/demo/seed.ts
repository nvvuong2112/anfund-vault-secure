import type { Loan, Offer } from "./types";

const NOW = () => Date.now();
const MIN = 60_000;

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
    auctionEndsAt: t + 8 * MIN,
    status: "open",
    offers: [],
    createdAt: t - 60 * MIN,
  };

  const offers1: Offer[] = [
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Quỹ đầu tư An Tín",
      lenderType: "fund",
      rate: 7.2,
      amount: 500_000_000,
      term: 120,
      conditions: "Cố định 12 tháng đầu, giải ngân 24h",
      collateralRequirement: "BĐS thế chấp",
      fitScore: 92,
      createdAt: t - 30 * MIN,
      status: "pending",
    },
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Capital Partner V",
      lenderType: "fund",
      rate: 7.5,
      amount: 500_000_000,
      term: 120,
      conditions: "Cố định 6 tháng đầu, giải ngân 48h",
      collateralRequirement: "BĐS thế chấp",
      fitScore: 88,
      createdAt: t - 22 * MIN,
      status: "pending",
    },
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Việt Hưng Capital",
      lenderType: "company",
      rate: 8.0,
      amount: 500_000_000,
      term: 84,
      conditions: "Thả nổi sau 6 tháng, giải ngân 24h",
      collateralRequirement: "BĐS thế chấp",
      fitScore: 81,
      createdAt: t - 12 * MIN,
      status: "pending",
    },
    {
      id: id("off"),
      loanId: loan1.id,
      lenderName: "Mr. Lê (Cá nhân)",
      lenderType: "individual",
      rate: 7.8,
      amount: 300_000_000,
      term: 60,
      conditions: "Tín chấp một phần, giải ngân 72h",
      collateralRequirement: "Đồng ký",
      fitScore: 75,
      createdAt: t - 6 * MIN,
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
    auctionEndsAt: t + 35 * MIN,
    status: "open",
    offers: [
      {
        id: id("off"),
        loanId: "tmp",
        lenderName: "MeKong Growth Fund",
        lenderType: "fund",
        rate: 9.5,
        amount: 1_500_000_000,
        term: 36,
        conditions: "Giải ngân theo tiến độ, kiểm soát dòng tiền",
        collateralRequirement: "BĐS xưởng",
        fitScore: 84,
        createdAt: t - 18 * MIN,
        status: "pending",
      },
      {
        id: id("off"),
        loanId: "tmp",
        lenderName: "Nam Sài Gòn Invest",
        lenderType: "company",
        rate: 9.9,
        amount: 1_200_000_000,
        term: 24,
        conditions: "Giải ngân 1 lần, báo cáo dòng tiền hàng quý",
        collateralRequirement: "BĐS xưởng",
        fitScore: 78,
        createdAt: t - 8 * MIN,
        status: "pending",
      },
    ],
    createdAt: t - 25 * MIN,
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
    auctionEndsAt: t + 18 * MIN,
    status: "open",
    offers: [
      {
        id: id("off"),
        loanId: "tmp",
        lenderName: "EduFund VN",
        lenderType: "fund",
        rate: 8.5,
        amount: 200_000_000,
        term: 36,
        conditions: "Ân hạn gốc 12 tháng, giải ngân theo học kỳ",
        collateralRequirement: "Đồng ký",
        fitScore: 86,
        createdAt: t - 14 * MIN,
        status: "pending",
      },
    ],
    createdAt: t - 16 * MIN,
  };
  loan3.offers = loan3.offers.map((o) => ({ ...o, loanId: loan3.id }));

  return [loan1, loan2, loan3];
}

const FAKE_LENDERS = [
  { name: "Quỹ đầu tư An Tín", type: "fund" as const },
  { name: "Capital Partner V", type: "fund" as const },
  { name: "MeKong Growth Fund", type: "fund" as const },
  { name: "Nam Sài Gòn Invest", type: "company" as const },
  { name: "Việt Hưng Capital", type: "company" as const },
  { name: "EduFund VN", type: "fund" as const },
  { name: "Mr. Lê (Cá nhân)", type: "individual" as const },
  { name: "Bà Trần (Cá nhân)", type: "individual" as const },
  { name: "Tín Phát Holdings", type: "company" as const },
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
