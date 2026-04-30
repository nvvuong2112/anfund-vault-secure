import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Loan, NewLoanInput, NewOfferInput, Offer } from "./types";
import { buildSeedLoans, generateAutoOffer, makeId } from "./seed";

type DemoCtx = {
  loans: Loan[];
  selectedLoanId: string | null;
  selectLoan: (id: string | null) => void;
  createLoan: (data: NewLoanInput) => string;
  submitOffer: (loanId: string, data: NewOfferInput) => void;
  acceptOffer: (loanId: string, offerId: string) => void;
  resetDemo: () => void;
  now: number;
};

const Ctx = createContext<DemoCtx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>(() => buildSeedLoans());
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    setSelectedLoanId(loans[0]?.id ?? null);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.status === "open" && loan.auctionEndsAt <= now ? { ...loan, status: "closed" } : loan,
      ),
    );
  }, [now]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const scheduleAutoOffers = useCallback(
    (loanId: string, requestAmount: number, baseRate: number, term: number) => {
      const offerCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < offerCount; i++) {
        const delay = 2500 + Math.random() * 7000 + i * 1500;
        const t = setTimeout(() => {
          setLoans((prev) =>
            prev.map((loan) => {
              if (loan.id !== loanId || loan.status !== "open") return loan;
              const partial = generateAutoOffer(loanId, baseRate, requestAmount);
              const newOffer: Offer = {
                ...partial,
                id: makeId("off"),
                term: partial.term || term,
              };
              return { ...loan, offers: [...loan.offers, newOffer] };
            }),
          );
          timersRef.current.delete(t);
        }, delay);
        timersRef.current.add(t);
      }
    },
    [],
  );

  const createLoan = useCallback(
    (data: NewLoanInput) => {
      const t = Date.now();
      const newId = makeId("loan");
      const code = `HS-DEMO-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const DAY_MS = 24 * 60 * 60 * 1000;
      const loan: Loan = {
        id: newId,
        code,
        borrowerName: "Bạn (demo)",
        amount: data.amount,
        term: data.term,
        purpose: data.purpose,
        monthlyIncome: data.monthlyIncome,
        history: data.history,
        collateral: data.collateral,
        riskLevel: data.riskLevel,
        submittedAt: t - 11 * DAY_MS,
        verifiedAt: t - 5 * DAY_MS,
        auctionEndsAt: t + data.auctionDurationHours * 60 * 60 * 1000,
        status: "open",
        offers: [],
        fromDemoUser: true,
        createdAt: t,
      };
      setLoans((prev) => [loan, ...prev]);
      setSelectedLoanId(newId);
      const baseRate = data.riskLevel === "low" ? 7.5 : data.riskLevel === "medium" ? 8.8 : 10.5;
      scheduleAutoOffers(newId, data.amount, baseRate, data.term);
      return newId;
    },
    [scheduleAutoOffers],
  );

  const submitOffer = useCallback((loanId: string, data: NewOfferInput) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== loanId || loan.status !== "open") return loan;
        const fit = Math.round(70 + Math.random() * 25);
        const newOffer: Offer = {
          id: makeId("off"),
          loanId,
          lenderName: data.lenderName,
          lenderType: data.lenderType,
          lenderVerifiedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          rate: data.rate,
          amount: data.amount,
          term: data.term,
          conditions: data.conditions,
          collateralRequirement: data.collateralRequirement,
          fitScore: fit,
          createdAt: Date.now(),
          status: "pending",
          fromDemoUser: true,
        };
        return { ...loan, offers: [...loan.offers, newOffer] };
      }),
    );
  }, []);

  const acceptOffer = useCallback((loanId: string, offerId: string) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== loanId) return loan;
        return {
          ...loan,
          status: "matched",
          matchedOfferId: offerId,
          offers: loan.offers.map((o) =>
            o.id === offerId ? { ...o, status: "selected" } : { ...o, status: "rejected" },
          ),
        };
      }),
    );
  }, []);

  const resetDemo = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
    const fresh = buildSeedLoans();
    setLoans(fresh);
    setSelectedLoanId(fresh[0]?.id ?? null);
  }, []);

  const value = useMemo<DemoCtx>(
    () => ({
      loans,
      selectedLoanId,
      selectLoan: setSelectedLoanId,
      createLoan,
      submitOffer,
      acceptOffer,
      resetDemo,
      now,
    }),
    [loans, selectedLoanId, createLoan, submitOffer, acceptOffer, resetDemo, now],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used within DemoProvider");
  return v;
}
