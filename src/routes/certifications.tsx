import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { Certifications } from "@/components/sections/Certifications";
import { FinalCta } from "@/components/sections/FinalCta";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications & Credentials | ORVIONAR Tech" },
      {
        name: "description",
        content:
          "See sample ORVIONAR credentials: course completion, internship completion, project completion and letter of recommendation, subject to eligibility.",
      },
      { property: "og:title", content: "Certifications & Credentials | ORVIONAR Tech" },
      {
        property: "og:description",
        content: "Sample credentials issued to eligible ORVIONAR students.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Certifications"
        title="Credentials That Strengthen Your Profile"
        subtitle="Samples shown for reference only. Eligibility depends on program requirements and performance criteria."
      />
      <Certifications />
      <FinalCta />
    </>
  );
}
