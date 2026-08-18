import { createFileRoute, useSearch } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { AdmissionWizard } from "@/components/enroll/AdmissionWizard";

type EnrollSearch = { domain?: string };

export const Route = createFileRoute("/enroll")({
  validateSearch: (search: Record<string, unknown>): EnrollSearch =>
    typeof search["domain"] === "string" ? { domain: search["domain"] } : {},
  head: () => ({
    meta: [
      { title: "Apply Now | ORVIONAR 3-Month Program Admission" },
      {
        name: "description",
        content:
          "Complete the ORVIONAR admission form to apply for the 3-month training, project and internship program. Takes about 3 minutes.",
      },
      { property: "og:title", content: "Apply Now | ORVIONAR 3-Month Program Admission" },
      {
        property: "og:description",
        content: "Submit your ORVIONAR admission application and get your Application ID instantly.",
      },
    ],
  }),
  component: Enroll,
});

function Enroll() {
  const { domain } = useSearch({ from: "/enroll" });
  return (
    <>
      <PageHeader
        eyebrow="Admission"
        title="Apply for the 3-Month Program"
        subtitle="Submitting this form creates an application. Admission is confirmed only after our admissions team completes the process."
      />
      <section className="container-page py-14">
        <AdmissionWizard {...(domain ? { presetDomain: domain } : {})} />
      </section>
    </>
  );
}
