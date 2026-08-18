import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | ORVIONAR 3-Month Program Questions Answered" },
      {
        name: "description",
        content:
          "Answers about ORVIONAR's 3-month program: duration, class timings, mode, projects, certificates, stipend eligibility and placement assistance.",
      },
      { property: "og:title", content: "FAQ | ORVIONAR 3-Month Program" },
      {
        property: "og:description",
        content: "Common questions about duration, sessions, certificates and career support.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Still unsure about something? Reach out to our admissions team."
      />
      <FaqAccordion withHeading={false} />
      <FinalCta />
    </>
  );
}
