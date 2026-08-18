import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | ORVIONAR Tech" },
      {
        name: "description",
        content:
          "Terms governing use of the ORVIONAR admissions website, applications, credentials, stipend eligibility and placement assistance.",
      },
      { property: "og:title", content: "Terms & Conditions | ORVIONAR Tech" },
      {
        property: "og:description",
        content: "Terms covering applications, credentials and career support at ORVIONAR.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <section className="container-page py-14">
        <div className="max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          <Section title="Applications">
            Submitting the admission form creates an application only. Admission is confirmed solely
            after {SITE.company} completes its admissions process and communicates confirmation.
          </Section>
          <Section title="Program delivery">
            Program structure, batch months, mode of delivery and schedules may change. Applicable
            details are communicated to enrolled students.
          </Section>
          <Section title="Credentials">
            Course, internship, project completion credentials and letters of recommendation are
            issued to eligible students based on program requirements and performance criteria.
            Sample documents shown on this website are for illustration only.
          </Section>
          <Section title="Stipend">
            Where applicable to the selected program and batch, a performance-based stipend may
            apply. Eligibility and amount are subject to the program's applicable performance
            criteria and company terms.
          </Section>
          <Section title="Placement assistance">
            ORVIONAR provides career support and placement assistance. Employment or placement is
            not guaranteed.
          </Section>
          <Section title="Learning platform">
            The learning management system is provided through a third-party platform. Access is
            available to enrolled students as per program terms.
          </Section>
          <Section title="Contact">
            Questions about these terms can be sent to{" "}
            <a className="font-medium text-primary hover:underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}
