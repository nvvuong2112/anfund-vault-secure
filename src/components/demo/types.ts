export type LenderType = "fund" | "company" | "individual";

export type Offer = {
  id: string;
  loanId: string;
  lenderName: string;
  lenderType: LenderType;
  lenderVerifiedAt: number;
  rate: number;
  amount: number;
  term: number;
  conditions: string;
  collateralRequirement: string;
  fitScore: number;
  createdAt: number;
  status: "pending" | "selected" | "rejected";
  fromDemoUser?: boolean;
};

export type RiskLevel = "low" | "medium" | "high";

export type Loan = {
  id: string;
  code: string;
  borrowerName: string;
  amount: number;
  term: number;
  purpose: string;
  monthlyIncome: number;
  history: string;
  collateral: string;
  riskLevel: RiskLevel;
  verifiedAt: number;
  submittedAt: number;
  auctionEndsAt: number;
  status: "open" | "matched" | "closed";
  offers: Offer[];
  matchedOfferId?: string;
  fromDemoUser?: boolean;
  createdAt: number;
};

export type NewLoanInput = {
  amount: number;
  term: number;
  purpose: string;
  monthlyIncome: number;
  history: string;
  collateral: string;
  riskLevel: RiskLevel;
  auctionDurationHours: number;
};

export type NewOfferInput = {
  lenderName: string;
  lenderType: LenderType;
  rate: number;
  amount: number;
  term: number;
  conditions: string;
  collateralRequirement: string;
};

export const MIN_AUCTION_HOURS = 8;
export const VERIFICATION_DAYS = 5;
