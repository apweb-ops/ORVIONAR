import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { siteConfigQuery } from "@/lib/queries";
import { track } from "@/lib/analytics";

const highlights = [
  "Practical learning",
  "Live interactive sessions",
  "Career-defining projects",
  "Learning activities",
  "Community access",
  "Career support",
];

export function AboutSection() {
  return (
    <section id="about" className="container-page py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">About</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">About ORVIONAR</h2>
          <p className="mt-4 text-muted-foreground">
            ORVIONAR focuses on practical learning, industry-oriented skills, projects, internships,
            and career development. The 3-month program is built so students move from structured
            learning to real project work and then into career preparation.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-navy">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="h-full rounded-2xl border bg-surface p-8">
            <h3 className="text-xl font-bold text-navy">Continue Learning Online</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enrolled students get LMS access for session material and learning activities. The LMS
              is hosted on Teachmint — this website is the admissions platform, not the LMS.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <LmsLink />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LmsLink() {
  const { data: config } = useQuery(siteConfigQuery);
  const url = config?.["lms_url"] || SITE.lms;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("lms_clicked", "about")}
    >
      Access LMS <ExternalLink className="size-4" aria-hidden="true" />
    </a>
  );
}

export function LocationSection() {
  const { data: config } = useQuery(siteConfigQuery);
  const phone = config?.["contact_phone"] || SITE.phone;
  const email = config?.["contact_email"] || SITE.email;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;

  return (
    <section id="location" className="bg-surface py-20">
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Location</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">Visit ORVIONAR</h2>
          <address className="mt-6 space-y-4 text-sm text-muted-foreground not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {SITE.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <a className="hover:text-primary" href={`tel:${phone.replace(/\s/g, "")}`}>
                {phone}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <a className="hover:text-primary" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          </address>
          <Button asChild variant="navy" size="lg" className="mt-6">
            <a href={directions} target="_blank" rel="noopener noreferrer">
              Get Directions
            </a>
          </Button>
        </Reveal>

        <Reveal delay={100}>
          <div className="overflow-hidden rounded-2xl border shadow-[var(--shadow-card)]">
            <iframe
              title="ORVIONAR Tech location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
