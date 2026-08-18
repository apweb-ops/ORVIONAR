import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/analytics";

export function FinalCta() {
  return (
    <section className="container-page py-20">
      <Reveal>
        <div className="surface-hero rounded-3xl px-8 py-14 text-center text-navy-foreground md:px-16">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold text-white md:text-5xl">
            Your Career Journey Starts Here.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Choose your domain. Build real skills. Work on projects. Gain internship experience.
            Prepare for your next opportunity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/enroll" onClick={() => track("enroll_clicked", "final_cta")}>
                Apply for the 3-Month Program
              </Link>
            </Button>
            <Button asChild variant="onDark" size="xl">
              <Link to="/programs">Explore Programs</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
