import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";
import { FAQS } from "@/lib/site";

export function FaqAccordion({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section id="faq" className="container-page py-20">
      {withHeading && (
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>
      )}
      <div className="mt-8 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-navy">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
