import { useQuery } from "@tanstack/react-query";
import { Linkedin, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/Reveal";
import { testimonialsQuery } from "@/lib/queries";
import { track } from "@/lib/analytics";

export function StudentStories() {
  const { data, isLoading } = useQuery(testimonialsQuery);

  return (
    <section id="stories" className="bg-surface py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Social proof</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">
            What Students Are Sharing
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Posts shared publicly by ORVIONAR students on LinkedIn. Only genuine, verified student
            posts are listed here.
          </p>
        </Reveal>

        {isLoading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && (data?.length ?? 0) === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            Student stories will appear here once published by the ORVIONAR team.
          </p>
        )}

        {!!data?.length && (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((t, i) => (
              <Reveal as="li" key={t.id} delay={i * 60}>
                <article className="card-lift flex h-full flex-col rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
                  <Quote className="size-6 text-primary/40" aria-hidden="true" />
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.excerpt}</p>
                  <div className="mt-5 border-t pt-4">
                    <p className="text-sm font-bold text-navy">{t.student_name}</p>
                    {t.program && <p className="text-xs text-muted-foreground">{t.program}</p>}
                    {t.linkedin_url && (
                      <a
                        href={t.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("linkedin_clicked", "testimonial")}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        <Linkedin className="size-4" aria-hidden="true" /> View LinkedIn Post
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
