import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login | ORVIONAR" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setLoading(false);
      toast.error(error?.message ?? "Unable to sign in.");
      return;
    }
    const { data: isAdmin, error: roleError } = await supabase.rpc("is_active_admin", {
      candidate: data.user.id,
    });
    setLoading(false);
    if (roleError || !isAdmin) {
      await supabase.auth.signOut();
      toast.error("You do not have administrator access.");
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-[var(--shadow-card)]">
        <Logo />
        <div className="mt-10 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-navy">Admin login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Admissions and enrollment operations.</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Sign in securely
          </Button>
        </form>
      </section>
    </main>
  );
}
