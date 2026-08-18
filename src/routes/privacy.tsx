import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ORVIONAR Tech" },
      {
        name: "description",
        content:
          "How ORVIONAR Tech Private Limited collects, uses and protects student information submitted through admission and contact forms.",
      },
      { property: "og:title", content: "Privacy Policy | ORVIONAR Tech" },
      {
        property: "og:description",
        content: "How ORVIONAR handles student data submitted on this website.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="container-page prose-legal py-14">
        <div className="max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            {SITE.company} ("ORVIONAR", "we", "us") operates this website as an admissions and
            enrollment platform. This policy explains what information we collect and how we use it.
          </p>
          <Section title="Information we collect">
            Details you submit through the admission or contact forms, such as your name, email,
            mobile and WhatsApp number, date of birth, college, degree, department, year of study,
            preferred domain, batch preferences and how you heard about us.
          </Section>
          <Section title="How we use your information">
            To process your application, contact you about admissions and counselling, share program
            information, and improve our services. We do not sell your personal information.
          </Section>
          <Section title="Communication consent">
            By submitting a form you agree that ORVIONAR may contact you by phone, email or WhatsApp
            regarding your application and related program updates.
          </Section>
          <Section title="Data retention and security">
            Application data is stored securely and retained for as long as needed for admissions
            and record-keeping purposes, or as required by law.
          </Section>
          <Section title="Your choices">
            You can request access, correction or deletion of your information by emailing{" "}
            <a className="font-medium text-primary hover:underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </Section>
          <Section title="Contact">
            {SITE.company}, {SITE.address.slice(1).join(" ")} · {SITE.phone}
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
