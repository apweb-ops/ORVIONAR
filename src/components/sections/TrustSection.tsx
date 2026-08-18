import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ShieldCheck, Building2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { siteConfigQuery } from "@/lib/queries";

export function TrustSection() {
  const { data: config } = useQuery(siteConfigQuery);
  const note =
    config?.["trust_note"] ??
    "Credentials and certifications may vary by program and eligibility. Verify applicable details with ORVIONAR before enrollment.";

  return (
    <section className="border-y bg-navy py-16 text-navy-foreground">
      <div className="container-page">
        <Reveal>
          <h2 className="text-3xl font-extrabold md:text-4xl">Trusted Learning & Career Experience</h2>
          <p className="mt-3 max-w-3xl text-white/70">{note}</p>
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Building2, title: "Registered company", text: "ORVIONAR TECH PRIVATE LIMITED, Bengaluru." },
            { icon: BadgeCheck, title: "Program credentials", text: "Course, internship and project credentials for eligible students." },
            { icon: ShieldCheck, title: "Transparent process", text: "An application platform — no admission is confirmed until our team completes the process." },
          ].map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-6">
                <item.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-white/70">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
