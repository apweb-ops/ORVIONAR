import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/Reveal";
import certTraining from "@/assets/cert-training-internship.jpg";
import certProject from "@/assets/cert-project-completion.jpg";
import certOffer from "@/assets/cert-offer-letter.jpg";
import certLor from "@/assets/cert-letter-of-recommendation.jpg";

const certificates = [
  {
    title: "Course Completion Certificate",
    image: certTraining,
    note: "Issued to eligible students after completing the training phase requirements.",
  },
  {
    title: "Internship Completion Certificate",
    image: certOffer,
    note: "Reflects the structured internship experience as per program terms.",
  },
  {
    title: "Project Completion Certificate",
    image: certProject,
    note: "Recognises completion of the assigned minor and major project work.",
  },
  {
    title: "Letter of Recommendation",
    image: certLor,
    note: "Issued at ORVIONAR's discretion based on performance criteria.",
  },
];

export function Certifications() {
  const [open, setOpen] = useState<(typeof certificates)[number] | null>(null);

  return (
    <section id="certifications" className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Certifications</p>
        <h2 className="mt-2 max-w-3xl text-3xl font-extrabold text-navy md:text-4xl">
          Build Credentials That Strengthen Your Profile
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Sample documents shown for reference only. Credential eligibility depends on program
          requirements and performance criteria.
        </p>
      </Reveal>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((c, i) => (
          <Reveal as="li" key={c.title} delay={i * 70}>
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="card-lift group h-full w-full cursor-pointer overflow-hidden rounded-2xl border bg-card text-left shadow-[var(--shadow-card)]"
            >
              <span className="relative block overflow-hidden bg-surface">
                <img
                  src={c.image}
                  alt={`${c.title} sample document, watermarked SAMPLE`}
                  loading="lazy"
                  width={1000}
                  height={700}
                  className="aspect-[4/3] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute top-2 right-2 rounded-md bg-ink/80 px-2 py-1 text-[10px] font-bold tracking-widest text-white">
                  SAMPLE
                </span>
              </span>
              <span className="block p-5">
                <span className="block text-base font-bold text-navy">{c.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{c.note}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy">{open?.title} — Sample</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="relative">
              <img
                src={open.image}
                alt={`${open.title} sample preview`}
                className="w-full rounded-lg border"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid place-items-center text-5xl font-black tracking-[0.4em] text-ink/10 select-none md:text-7xl"
              >
                SAMPLE
              </span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Displayed for illustration only. Blank or editable certificate templates are not
            distributed.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
