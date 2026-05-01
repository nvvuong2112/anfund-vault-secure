import { cn } from "@/lib/utils";

type LogoVariant = "horizontal" | "vertical" | "icon";

const LOGO_SRC: Record<LogoVariant | "dark", string> = {
  horizontal: "/brand/anfund-logo-horizontal.png",
  vertical: "/brand/anfund-logo-vertical.png",
  icon: "/brand/anfund-logo-icon.png",
  dark: "/brand/anfund-logo-dark.png",
};

export function Logo({
  className,
  variant = "horizontal",
  dark = false,
}: {
  className?: string;
  variant?: LogoVariant;
  dark?: boolean;
}) {
  const src = dark ? LOGO_SRC.dark : LOGO_SRC[variant];
  const size =
    variant === "icon" ? "h-11 w-11" : variant === "vertical" ? "h-28 w-auto" : "h-10 w-auto";

  return (
    <img
      src={src}
      alt="AnFund - Kết nối dòng vốn, nâng tầm khát vọng"
      className={cn("block object-contain", size, className)}
    />
  );
}
