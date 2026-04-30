import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "emerald";
}) {
  const dot = tone === "gold" ? "bg-accent" : tone === "emerald" ? "bg-emerald" : "bg-primary";
  return (
    <div className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "navy",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  tone?: "navy" | "gold" | "emerald";
}) {
  return (
    <div className={cn("mx-auto max-w-3xl", align === "center" ? "text-center" : "text-left mx-0")}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2 className="reveal mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="reveal mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
  );
}
