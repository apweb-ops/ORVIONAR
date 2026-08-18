import {
  Calculator,
  FileText,
  Globe,
  Handshake,
  MessagesSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CAREER_SUPPORT } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  FileText,
  Calculator,
  Users,
  MessagesSquare,
  Globe,
  Handshake,
};

export function CareerSupport() {
  return (
    <section id="career-support" className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Career support</p>
        <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">
          We Don't Stop at Training
        </h2>
      </Reveal>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CAREER_SUPPORT.map((c, i) => {
          const Icon = icons[c.icon] ?? FileText;
          return (
            <Reveal as="li" key={c.title} delay={i * 60}>
              <div className="card-lift h-full rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
                <span className="grid size-11 place-items-center rounded-xl bg-navy/5 text-navy">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
      <p className="mt-6 text-xs text-muted-foreground">
        ORVIONAR provides placement assistance and career support. Outcomes are subject to
        applicable program terms and individual performance.
      </p>
    </section>
  );
}
