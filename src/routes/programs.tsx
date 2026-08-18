import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { ProgramGrid } from "@/components/programs/ProgramGrid";
import { FinalCta } from "@/components/sections/FinalCta";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Career Domains & Programs | ORVIONAR Tech" },
      {
        name: "description",
        content:
          "Browse ORVIONAR career domains across technology, data, business, design, management, core engineering and healthcare, then apply to the 3-month program.",
      },
      { property: "og:title", content: "Career Domains & Programs | ORVIONAR Tech" },
      {
        property: "og:description",
        content: "Search ORVIONAR's career domains and apply to the 3-month internship program.",
      },
    ],
  }),
  component: Programs,
});

function Programs() {
  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Choose Your Career Domain"
        subtitle="Every domain follows the same 3-month structure: learning, projects and internship, then career development."
      />
      <section className="container-page py-14">
        <ProgramGrid />
      </section>
      <FinalCta />
    </>
  );
}
