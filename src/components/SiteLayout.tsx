import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { track } from "@/lib/analytics";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    track("page_view", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b bg-surface">
      <div className="container-page py-14 md:py-20">
        {eyebrow && (
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-navy md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
