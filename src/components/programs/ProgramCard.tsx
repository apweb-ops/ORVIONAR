import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Program } from "@/lib/queries";
import { track } from "@/lib/analytics";

export function ProgramCard({
  program,
  onViewDetails,
}: {
  program: Program;
  onViewDetails: (p: Program) => void;
}) {
  return (
    <article className="card-lift flex h-full flex-col rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-base font-black text-primary"
        >
          {program.name.slice(0, 2).toUpperCase()}
        </span>
        <Badge variant="secondary" className="shrink-0">
          {program.category}
        </Badge>
      </div>

      <h3 className="mt-4 text-lg leading-snug font-bold text-navy">{program.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{program.description}</p>

      {program.skills?.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {program.skills.slice(0, 4).map((s) => (
            <li
              key={s}
              className="rounded-full border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            track("program_viewed", program.slug);
            onViewDetails(program);
          }}
        >
          View Details <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
        <Button asChild size="sm" variant="hero">
          <Link
            to="/enroll"
            search={{ domain: program.name }}
            onClick={() => track("enroll_clicked", program.slug)}
          >
            Enroll Now
          </Link>
        </Button>
      </div>
    </article>
  );
}
