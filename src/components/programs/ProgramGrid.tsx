import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/Reveal";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { ProgramModal } from "@/components/programs/ProgramModal";
import { programsQuery, type Program } from "@/lib/queries";
import { PROGRAM_CATEGORIES } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ProgramGrid({
  initialQuery = "",
  limit,
}: {
  initialQuery?: string;
  limit?: number;
}) {
  const { data, isLoading, isError, refetch } = useQuery(programsQuery);
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState<string>("All");
  const [selected, setSelected] = useState<Program | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = data ?? [];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (term) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.skills ?? []).some((s) => s.toLowerCase().includes(term)),
      );
    }
    return limit ? list.slice(0, limit) : list;
  }, [data, q, category, limit]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your domain..."
            aria-label="Search career domains"
            className="h-12 pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["All", ...PROGRAM_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold text-navy">We couldn't load the programs right now.</p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed p-12 text-center">
          <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy">No domains match your search.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different keyword, or choose "Other" in the admission form to tell us your domain.
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal as="li" key={p.id} delay={Math.min(i, 6) * 50}>
              <ProgramCard program={p} onViewDetails={setSelected} />
            </Reveal>
          ))}
        </ul>
      )}

      <ProgramModal program={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
