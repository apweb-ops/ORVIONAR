import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, LogOut, Search, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { joiningMonthsQuery } from "@/lib/queries";
import { APPLICATION_STATUSES } from "@/lib/site";

type Admission = {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  domain: string;
  custom_domain: string | null;
  preferred_mode: string | null;
  joining_month: string | null;
  preferred_session: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admissions Console | ORVIONAR Staff" },
      {
        name: "description",
        content: "Internal ORVIONAR console for reviewing student applications and batch settings.",
      },
      { property: "og:title", content: "Admissions Console | ORVIONAR Staff" },
      { property: "og:description", content: "Internal ORVIONAR admissions console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const admissions = useQuery({
    queryKey: ["admissions"],
    queryFn: async (): Promise<Admission[]> => {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Admission[];
    },
  });

  const months = useQuery(joiningMonthsQuery);

  const updateStatus = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase.from("admissions").update({ status: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated.");
      qc.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: () => toast.error("Could not update status."),
  });

  const toggleMonth = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("joining_months").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Batch month updated.");
      qc.invalidateQueries({ queryKey: ["joining_months"] });
    },
    onError: () => toast.error("Could not update batch month."),
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (admissions.data ?? []).filter((a) => {
      if (status !== "All" && a.status !== status) return false;
      if (!term) return true;
      return [a.application_id, a.full_name, a.email, a.phone, a.college, a.domain]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [admissions.data, q, status]);

  const exportCsv = () => {
    const headers = [
      "application_id",
      "full_name",
      "email",
      "phone",
      "college",
      "domain",
      "preferred_mode",
      "joining_month",
      "preferred_session",
      "source",
      "status",
      "created_at",
    ] as const;
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `orvionar-admissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isForbidden =
    admissions.isError || (!admissions.isLoading && (admissions.data?.length ?? 0) === 0 && false);

  const stats = [
    { label: "Total applications", value: admissions.data?.length ?? 0 },
    { label: "New", value: (admissions.data ?? []).filter((a) => a.status === "New").length },
    {
      label: "Enrolled",
      value: (admissions.data ?? []).filter((a) => a.status === "Enrolled").length,
    },
    { label: "Active batch months", value: (months.data ?? []).filter((m) => m.active).length },
  ];

  return (
    <section className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Admissions Console</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review applications, update statuses and manage batch months.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
            <Download className="size-4" aria-hidden="true" /> Export CSV
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </Button>
        </div>
      </div>

      {isForbidden && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <ShieldAlert className="mt-0.5 size-5 text-destructive" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Your account doesn't have admissions access. Ask an ORVIONAR administrator to grant your
            account a staff role.
          </p>
        </div>
      )}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-navy">{s.value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, ID, college..."
            aria-label="Search applications"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-56" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", ...APPLICATION_STATUSES].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {admissions.isLoading ? (
        <Skeleton className="mt-6 h-64 rounded-2xl" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-surface text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                {["Application", "Student", "Contact", "Domain", "Batch", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy">{r.application_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{r.full_name}</p>
                    <p className="text-xs text-muted-foreground">{r.college}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <p>{r.email}</p>
                    <p>{r.phone}</p>
                  </td>
                  <td className="px-4 py-3">{r.custom_domain || r.domain}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <p>{r.joining_month ?? "—"}</p>
                    <p>
                      {r.preferred_mode ?? "—"} · {r.preferred_session ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={r.status}
                      onValueChange={(value) => updateStatus.mutate({ id: r.id, value })}
                    >
                      <SelectTrigger className="w-48" aria-label={`Status for ${r.application_id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLICATION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No applications match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-12 text-xl font-bold text-navy">Batch Months</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {(months.data ?? []).map((m) => (
          <li key={m.id}>
            <Button
              variant={m.active ? "hero" : "outline"}
              size="sm"
              onClick={() => toggleMonth.mutate({ id: m.id, active: !m.active })}
            >
              {m.month}
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Active months appear as joining options in the admission form.
      </p>
    </section>
  );
}
