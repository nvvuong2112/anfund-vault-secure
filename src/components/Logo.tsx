import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
        style={{ background: "var(--gradient-navy)" }}
        aria-hidden
      >
        <span className="text-[15px] font-bold tracking-tight">A</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
      </div>
      <div className="leading-none">
        <div
          className={cn(
            "text-base font-bold tracking-tight",
            light ? "text-white" : "text-foreground",
          )}
        >
          AnFund
        </div>
        <div
          className={cn(
            "mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em]",
            light ? "text-white/70" : "text-muted-foreground",
          )}
        >
          AnVốn
        </div>
      </div>
    </div>
  );
}
