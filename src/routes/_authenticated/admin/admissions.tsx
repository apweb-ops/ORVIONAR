import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { AdmissionsTable } from "@/components/admin/AdmissionsTable";

export const Route = createFileRoute("/_authenticated/admin/admissions")({
  head: () => ({
    meta: [{ title: "Admissions | ORVIONAR Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdmissionsPage,
});

function AdmissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin operations"
        title="Admission applications"
        subtitle="Search, filter, export, and follow up with students who submitted the enrollment form."
      />
      <section className="container-page py-10">
        <AdmissionsTable />
      </section>
    </>
  );
}
