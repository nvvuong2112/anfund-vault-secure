import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "#home", label: "Trang chủ" },
  { href: "#how-it-works", label: "Cách hoạt động" },
  { href: "#borrower", label: "Người vay" },
  { href: "#lender", label: "Người cho vay" },
  { href: "#auction", label: "Đấu giá vốn" },
  { href: "#verification", label: "Xác minh" },
  { href: "#safety", label: "An toàn" },
  { href: "/demo", label: "Demo" },
  { href: "#signup", label: "Đăng ký" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-background/80 backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <a href="#home" aria-label="AnFund" className="shrink-0">
          <Logo className="h-9 sm:h-10" />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="outline"
            className="rounded-md border-primary/20 px-4 hover:bg-primary/5"
          >
            <a href="/demo">Trải nghiệm demo</a>
          </Button>
          <Button asChild className="rounded-md px-4 shadow-sm">
            <a href="#signup">
              Tham gia danh sách chờ
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-300",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-4 py-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {item.label}
            </a>
          ))}
          <Button asChild variant="outline" className="mt-3 w-full rounded-md">
            <a href="/demo" onClick={() => setOpen(false)}>
              Trải nghiệm demo
            </a>
          </Button>
          <Button asChild className="mt-2 w-full rounded-md">
            <a href="#signup" onClick={() => setOpen(false)}>
              Tham gia danh sách chờ
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
