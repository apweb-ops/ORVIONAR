import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { programsQuery, joiningMonthsQuery } from "@/lib/queries";
import { APPLICATION_STATUSES } from "@/lib/site";

export type AdminAdmission = {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  college: string;
  degree: string | null;
  department: string | null;
  current_year: string | null;
  graduation_year: string | null;
  domain: string;
  custom_domain: string | null;
  preferred_mode: string | null;
  joining_month: string | null;
  preferred_session: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function useAdmissions() {
  return useQuery({
    queryKey: ["admin", "admissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminAdmission[];
    },
    refetchInterval: 30_000,
  });
}

export function AdmissionsTable() {
  const admissions = useAdmissions();
  const programs = useQuery(programsQuery);
  const months = useQuery(joiningMonthsQuery);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [domain, setDomain] = useState("All");
  const [month, setMonth] = useState("All");
  const [range, setRange] = useState("All time");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const now = Date.now();
    const cutoff =
      range === "Today"
        ? now - 86_400_000
        : range === "Last 7 days"
          ? now - 7 * 86_400_000
          : range === "Last 30 days"
            ? now - 30 * 86_400_000
            : 0;
    return (admissions.data ?? []).filter((item) => {
      const searchable = [
        item.application_id,
        item.full_name,
        item.email,
        item.phone,
        item.college,
        item.domain,
        item.custom_domain,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!term || searchable.includes(term)) &&
        (status === "All" || item.status === status) &&
        (domain === "All" || item.domain === domain) &&
        (month === "All" || item.joining_month === month) &&
        (!cutoff || new Date(item.created_at).getTime() >= cutoff)
      );
    });
  }, [admissions.data, query, status, domain, month, range]);

  const exportCsv = () => {
    const headers = [
      "Application ID",
      "Name",
      "Email",
      "Phone",
      "College",
      "Domain",
      "Joining Month",
      "Status",
      "Created Date",
    ];
    const values = rows.map((item) => [
      item.application_id,
      item.full_name,
      item.email,
      item.phone,
      item.college,
      item.custom_domain || item.domain,
      item.joining_month ?? "",
      item.status,
      item.created_at,
    ]);
    const csv = [headers, ...values]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    anchor.download = `orvionar-admissions-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
  };

  if (admissions.isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (admissions.isError)
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load admission data. Please try again.
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search application, name, email, college..."
            aria-label="Search applications"
            className="pl-9"
          />
        </div>
        <Filter
          value={status}
          onChange={setStatus}
          label="Status"
          options={["All", ...APPLICATION_STATUSES]}
        />
        <Filter
          value={domain}
          onChange={setDomain}
          label="Domain"
          options={["All", ...(programs.data ?? []).map((item) => item.name)]}
        />
        <Filter
          value={month}
          onChange={setMonth}
          label="Month"
          options={["All", ...(months.data ?? []).map((item) => item.month)]}
        />
        <Filter
          value={range}
          onChange={setRange}
          label="Date"
          options={["All time", "Today", "Last 7 days", "Last 30 days"]}
        />
        <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
          <Download className="size-4" aria-hidden="true" /> Export
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Showing {rows.length} of {admissions.data?.length ?? 0} applications.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted-foreground">
            <tr>
              {[
                "Application",
                "Student",
                "Contact",
                "Domain",
                "College",
                "Month",
                "Status",
                "Action",
              ].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="px-4 py-3 font-semibold text-navy">
                  {item.application_id}
                  <p className="text-xs font-normal text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">{item.full_name}</p>
                  <p className="text-xs text-muted-foreground">{item.degree ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <p>{item.email}</p>
                  <p>{item.phone}</p>
                </td>
                <td className="px-4 py-3">{item.custom_domain || item.domain}</td>
                <td className="px-4 py-3">{item.college}</td>
                <td className="px-4 py-3">{item.joining_month ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to="/admin/admissions/$applicationId"
                      params={{ applicationId: item.application_id }}
                    >
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                  No admission applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Filter({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-44" aria-label={`Filter by ${label}`}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
