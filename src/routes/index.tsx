import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { AdmissionBanner } from "@/components/sections/AdmissionBanner";
import { Benefits } from "@/components/sections/Benefits";
import { ThreeMonthTimeline } from "@/components/sections/ThreeMonthTimeline";
import { ProgramGrid } from "@/components/programs/ProgramGrid";
import { Certifications } from "@/components/sections/Certifications";
import { CareerSupport } from "@/components/sections/CareerSupport";
import { StudentStories } from "@/components/sections/StudentStories";
import { TrustSection } from "@/components/sections/TrustSection";
import { AboutSection, LocationSection } from "@/components/sections/AboutLmsLocation";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORVIONAR Tech | 3-Month Internship & Career Program Admissions" },
      {
        name: "description",
        content:
          "Apply to ORVIONAR's 3-month training, project and internship program in Bengaluru. Live sessions, real projects, certifications and placement assistance.",
      },
      { property: "og:title", content: "ORVIONAR Tech | Learn. Build. Intern. Get Career Ready." },
      {
        property: "og:description",
        content:
          "Student admissions for ORVIONAR's 3-month program — live learning, real projects, internship experience and career support.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <AdmissionBanner />
      <Benefits />
      <ThreeMonthTimeline />
      <section id="programs" className="bg-surface py-20">
        <div className="container-page">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">Programs</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">
              Choose Your Career Domain
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Explore domains across technology, data, business, design, management, core
              engineering and healthcare.
            </p>
          </Reveal>
          <div className="mt-8">
            <ProgramGrid />
          </div>
        </div>
      </section>
      <Certifications />
      <CareerSupport />
      <StudentStories />
      <TrustSection />
      <AboutSection />
      <LocationSection />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
