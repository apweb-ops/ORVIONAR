import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    const { data: isAdmin, error: roleError } = await supabase.rpc("is_active_admin", {
      candidate: data.user.id,
    });
    if (roleError || !isAdmin) throw redirect({ to: "/admin/login" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
