import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/admin/analytics"!</div>;
}
