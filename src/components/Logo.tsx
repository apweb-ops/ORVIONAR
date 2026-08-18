import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="ORVIONAR home"
      className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight", className)}
    >
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-lg font-black text-primary-foreground"
      >
        O
      </span>
      <span className={cn("text-xl", onDark ? "text-navy-foreground" : "text-ink")}>
        <span className="text-primary">OR</span>VIONAR
      </span>
    </Link>
  );
}
