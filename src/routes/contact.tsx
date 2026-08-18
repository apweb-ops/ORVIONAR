import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { ContactForm } from "@/components/ContactForm";
import { LocationSection } from "@/components/sections/AboutLmsLocation";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ORVIONAR Tech | Admissions Enquiry" },
      {
        name: "description",
        content:
          "Contact the ORVIONAR admissions team in HSR Layout, Bengaluru by form, phone, email or WhatsApp for program and enrollment questions.",
      },
      { property: "og:title", content: "Contact ORVIONAR Tech | Admissions Enquiry" },
      {
        property: "og:description",
        content: "Reach the ORVIONAR admissions team for program and enrollment questions.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the Admissions Team"
        subtitle="Send us your question and our team will get back to you."
      />
      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl">
          <ContactForm />
        </div>
      </section>
      <LocationSection />
    </>
  );
}
