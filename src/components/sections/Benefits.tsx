import {
  Briefcase,
  Code2,
  Handshake,
  Radio,
  TrendingUp,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BENEFITS } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  Radio,
  UserCheck,
  Code2,
  Briefcase,
  TrendingUp,
  Handshake,
};

export function Benefits() {
  return (
    <section id="benefits" className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Why ORVIONAR</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-extrabold text-navy md:text-4xl">
          Why Students Choose ORVIONAR
        </h2>
      </Reveal>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => {
          const Icon = icons[b.icon] ?? Code2;
          return (
            <Reveal as="li" key={b.title} delay={i * 60}>
              <div className="card-lift h-full rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
