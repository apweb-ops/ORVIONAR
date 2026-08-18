import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfigQuery } from "@/lib/queries";
import { track } from "@/lib/analytics";

export function AdmissionBanner() {
  const { data: config } = useQuery(siteConfigQuery);
  const deadline = config?.["admission_deadline"]?.trim();

  return (
    <section className="border-y bg-primary/10">
      <div className="container-page flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarCheck className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-base font-bold text-navy">Admissions Open</p>
            <p className="text-sm text-muted-foreground">
              Choose your domain and apply for the upcoming batch.
              {deadline ? ` Applications close on ${deadline}.` : ""}
            </p>
          </div>
        </div>
        <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
          <Link to="/enroll" onClick={() => track("enroll_clicked", "admission_banner")}>
            Secure Your Seat
          </Link>
        </Button>
      </div>
    </section>
  );
}
