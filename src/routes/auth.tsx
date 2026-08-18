import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | ORVIONAR Admissions Console" },
      {
        name: "description",
        content:
          "Secure sign-in for the ORVIONAR admissions team to review student applications and manage batches.",
      },
      { property: "og:title", content: "Staff Sign In | ORVIONAR Admissions Console" },
      { property: "og:description", content: "Internal sign-in for the ORVIONAR admissions team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)]">
        <span className="grid size-11 place-items-center rounded-xl bg-navy/5 text-navy">
          <Lock className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-navy">Staff Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Admissions console access for the ORVIONAR team only.
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Sign In
          </Button>
        </form>
      </div>
    </section>
  );
}
