import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { Benefits } from "@/components/sections/Benefits";
import { CareerSupport } from "@/components/sections/CareerSupport";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCta } from "@/components/sections/FinalCta";

export const Route = createFileRoute("/benefits")({
  head: () => ({
    meta: [
      { title: "Program Benefits | Why Students Choose ORVIONAR" },
      {
        name: "description",
        content:
          "Live interactive learning, industry mentorship, real-time projects, internship experience, career development and placement assistance at ORVIONAR.",
      },
      { property: "og:title", content: "Program Benefits | Why Students Choose ORVIONAR" },
      {
        property: "og:description",
        content: "Practical learning, projects, internship exposure and career support.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Benefits"
        title="Why Students Choose ORVIONAR"
        subtitle="A program designed around practical skills, real work and career readiness."
      />
      <Benefits />
      <CareerSupport />
      <TrustSection />
      <FinalCta />
    </>
  );
}
