import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NAV_LINKS } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md transition-shadow",
        scrolled ? "shadow-[var(--shadow-card)]" : "border-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  pathname === l.to && "bg-secondary text-foreground",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" className="hidden sm:inline-flex">
            <Link to="/enroll" onClick={() => track("enroll_clicked", "navbar")}>
              Enroll Now
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-lg border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t bg-background lg:hidden">
          <ul className="container-page grid gap-1 py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-base font-medium",
                    pathname === l.to ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 pb-3">
              <Button asChild variant="hero" size="lg" className="w-full">
                <Link to="/enroll" onClick={() => track("enroll_clicked", "mobile_nav")}>
                  Enroll Now
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
