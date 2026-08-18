import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { ThreeMonthTimeline } from "@/components/sections/ThreeMonthTimeline";
import { CareerSupport } from "@/components/sections/CareerSupport";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCta } from "@/components/sections/FinalCta";

export const Route = createFileRoute("/three-month-program")({
  head: () => ({
    meta: [
      { title: "The 3-Month Program Structure | ORVIONAR Tech" },
      {
        name: "description",
        content:
          "Month 1 learning, Month 2 projects and internship, Month 3 career development — see how ORVIONAR's 3-month program is structured week by week.",
      },
      { property: "og:title", content: "The 3-Month Program Structure | ORVIONAR Tech" },
      {
        property: "og:description",
        content: "Learning, projects and internship, then career development across three months.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Program"
        title="A Complete 3-Month Career Journey"
        subtitle="Four sessions a week — two weekday and two weekend sessions, 6:00 PM to 8:00 PM."
      />
      <ThreeMonthTimeline />
      <CareerSupport />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
