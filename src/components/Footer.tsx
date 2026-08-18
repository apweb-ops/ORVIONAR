import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

const programLinks = [
  "Full Stack Web Development",
  "Artificial Intelligence & Machine Learning",
  "Data Science",
  "Data Analytics",
  "Cloud Computing",
  "Cyber Security",
  "Python Programming Language",
  "DevOps",
];

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-ink text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo onDark />
          <p className="mt-4 text-sm text-white/70">{SITE.tagline}.</p>
          <p className="mt-2 text-xs text-white/50">{SITE.company}</p>
        </div>

        <nav aria-label="Programs">
          <h2 className="text-sm font-semibold text-white">Programs</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {programLinks.map((p) => (
              <li key={p}>
                <Link to="/programs" search={{ q: p }} className="hover:text-primary">
                  {p}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/programs" className="font-semibold text-primary hover:underline">
                View All Programs
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-sm font-semibold text-white">Company</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link to="/" hash="about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/certifications" className="hover:text-primary">
                Certifications
              </Link>
            </li>
            <li>
              <Link to="/student-stories" className="hover:text-primary">
                Student Stories
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Resources">
          <h2 className="text-sm font-semibold text-white">Resources</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a
                href={SITE.lms}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("lms_clicked", "footer")}
                className="hover:text-primary"
              >
                LMS
              </a>
            </li>
            <li>
              <Link to="/enroll" className="hover:text-primary">
                Admissions
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        <address className="text-sm text-white/70 not-italic">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{SITE.address.slice(1).join(" ")}</span>
            </li>
            <li>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("linkedin_clicked", "footer")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 hover:border-primary hover:text-primary"
              >
                <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
              </a>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ORVIONAR TECH PRIVATE LIMITED. All rights reserved.</p>
          <p>This website is an application and enquiry platform.</p>
        </div>
      </div>
    </footer>
  );
}
