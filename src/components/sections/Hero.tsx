import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-orvionar.jpg";
import { track } from "@/lib/analytics";

const trustPoints = [
  "3-Month Program",
  "Live Learning",
  "Real-Time Projects",
  "Internship Experience",
  "Career Support",
];

export function Hero() {
  return (
    <section className="surface-hero relative overflow-hidden text-navy-foreground">
      <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" /> Accelerate Your Future
          </p>
          <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold text-white md:text-6xl">
            Build Skills. Work on Real Projects.{" "}
            <span className="text-gradient-brand">Start Your Career.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/75 md:text-lg">
            Join ORVIONAR's 3-Month Training, Project & Internship Program designed to help students
            build practical skills, complete real-world projects and become career ready.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/programs">
                Explore Programs <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="onDark" size="xl">
              <Link to="/enroll" onClick={() => track("enroll_clicked", "hero")}>
                Apply Now
              </Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-white/70 sm:text-sm">
            {trustPoints.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 && <span className="text-primary">•</span>}
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl"
          />
          <img
            src={heroImage}
            alt="Illustration of a laptop with code, AI network, analytics charts and career growth arrow"
            width={1280}
            height={960}
            fetchPriority="high"
            className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
