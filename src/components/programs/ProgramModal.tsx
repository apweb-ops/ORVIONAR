import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Program } from "@/lib/queries";
import { track } from "@/lib/analytics";

const phases = [
  "Learning Phase",
  "Project Phase",
  "Internship Experience",
  "Career Development",
  "Certification eligibility",
];

export function ProgramModal({
  program,
  onOpenChange,
}: {
  program: Program | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!program} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {program && (
          <>
            <DialogHeader>
              <Badge variant="secondary" className="w-fit">
                {program.category}
              </Badge>
              <DialogTitle className="text-2xl font-extrabold text-navy">
                {program.name}
              </DialogTitle>
              <DialogDescription>{program.description}</DialogDescription>
            </DialogHeader>

            <section className="mt-2">
              <h3 className="text-sm font-bold tracking-wide text-primary uppercase">
                What You Will Learn
              </h3>
              {program.skills?.length ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {program.skills.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 text-sm text-muted-foreground">
                Detailed syllabus will be provided by the program team.
              </p>
            </section>

            <section className="mt-6 rounded-xl border bg-surface p-4">
              <p className="text-sm font-bold text-navy">Duration: {program.duration}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {phases.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-6">
              <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                <Link
                  to="/enroll"
                  search={{ domain: program.name }}
                  onClick={() => track("enroll_clicked", `modal_${program.slug}`)}
                >
                  Enroll in {program.name}
                </Link>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
