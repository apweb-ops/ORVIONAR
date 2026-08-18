import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Hammer, Rocket, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { siteConfigQuery } from "@/lib/queries";

type Phase = {
  month: string;
  tag: string;
  title: string;
  icon: LucideIcon;
  points: string[];
  extra?: string;
};

const phases: Phase[] = [
  {
    month: "01",
    tag: "Month 1 — Learn",
    title: "Learning Phase",
    icon: BookOpen,
    points: [
      "Online interactive sessions",
      "Live Q&A with mentors",
      "4 classes per week",
      "2 weekday sessions + 2 weekend sessions",
      "Session timing: 6:00 PM – 8:00 PM",
      "LMS access",
    ],
  },
  {
    month: "02",
    tag: "Month 2 — Build",
    title: "Project & Internship Phase",
    icon: Hammer,
    points: [
      "Real-time Capstone Project",
      "2 Minor Projects (2 credits each)",
      "1 Major Group Project (3 credits)",
      "Team collaboration: 25 students · 5 groups · 5 per group",
      "Practical project experience with mentor guidance",
    ],
  },
  {
    month: "03",
    tag: "Month 3 — Launch",
    title: "Career Development",
    icon: Rocket,
    points: [
      "Resume building",
      "Soft skills & communication training",
      "Aptitude and Group Discussion preparation",
      "Mock interviews",
      "Portfolio development",
      "Freelance project opportunities where available",
      "Placement assistance",
    ],
    extra: "Turn your learning into a career-ready profile.",
  },
];

export function ThreeMonthTimeline() {
  const { data: config } = useQuery(siteConfigQuery);
  const stipendActive = config?.["stipend_active"] === "true";
  const stipendText = config?.["stipend_text"] ?? "";

  return (
    <section id="program" className="bg-surface py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            3-Month Program
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">
            Your 3-Month Career Journey
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A structured path from learning fundamentals to building real projects and preparing
            for your first career opportunity.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {phases.map((p, i) => (
            <Reveal as="li" key={p.month} delay={i * 100}>
              <article className="card-lift relative h-full overflow-hidden rounded-2xl border bg-card p-7 shadow-[var(--shadow-card)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-6 -right-2 text-7xl font-black text-primary/10"
                >
                  {p.month}
                </span>
                <span className="grid size-11 place-items-center rounded-xl bg-navy text-navy-foreground">
                  <p.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-bold tracking-wide text-primary uppercase">
                  {p.tag}
                </p>
                <h3 className="mt-1 text-xl font-bold text-navy">{p.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {p.month === "02" && stipendActive && stipendText && (
                  <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-navy">{stipendText}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Eligibility and stipend are subject to the program's applicable performance
                      criteria and company terms.
                    </p>
                  </div>
                )}

                {p.extra && (
                  <p className="mt-5 rounded-xl bg-secondary p-4 text-sm font-semibold text-navy">
                    {p.extra}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </ol>

        <div className="mt-10">
          <Button asChild variant="hero" size="lg">
            <Link to="/enroll">Apply for the 3-Month Program</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
