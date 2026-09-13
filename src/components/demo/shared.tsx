import { Building2, User, Briefcase, ShieldCheck } from "lucide-react";
import type { LenderType, RiskLevel } from "./types";
import { cn } from "@/lib/utils";
import { formatCountdown, formatCountdownText } from "./format";

export function Countdown({ ms }: { ms: number }) {
  return (
    <>
      <span aria-hidden="true" suppressHydrationWarning>
        {formatCountdown(ms)}
      </span>
      <span className="sr-only" suppressHydrationWarning>
        {formatCountdownText(ms)}
      </span>
    </>
  );
}

export function LenderIcon({ type, className }: { type: LenderType; className?: string }) {
  const Icon = type === "fund" ? Building2 : type === "company" ? Briefcase : User;
  return <Icon className={className} />;
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map = {
    low: { label: "Rủi ro thấp", cls: "bg-emerald/10 text-emerald" },
    medium: { label: "Rủi ro trung bình", cls: "bg-accent/15 text-accent-foreground" },
    high: { label: "Rủi ro cao", cls: "bg-destructive/10 text-destructive" },
  } as const;
  const { label, cls } = map[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
        cls,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: "open" | "matched" | "closed" }) {
  const map = {
    open: { label: "Đang mở", cls: "bg-emerald/10 text-emerald" },
    matched: { label: "Đã khớp", cls: "bg-primary/10 text-primary" },
    closed: { label: "Đã đóng", cls: "bg-muted text-muted-foreground" },
  } as const;
  const { label, cls } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-semibold",
        cls,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function VerifiedBadge({
  verifiedAt,
  size = "md",
}: {
  verifiedAt?: number;
  size?: "sm" | "md";
}) {
  const days =
    verifiedAt != null
      ? Math.max(1, Math.floor((Date.now() - verifiedAt) / (24 * 60 * 60 * 1000)))
      : null;
  const cls = size === "sm" ? "px-1.5 py-0.5 text-[9px] gap-1" : "px-2 py-0.5 text-[10px] gap-1.5";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-emerald/40 bg-emerald/10 font-semibold text-emerald",
        cls,
      )}
      title={verifiedAt ? `Đã được AnFund xác minh ${days} ngày trước` : "Đã được AnFund xác minh"}
    >
      <ShieldCheck className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      Đã xác minh
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Demo
    </span>
  );
}
