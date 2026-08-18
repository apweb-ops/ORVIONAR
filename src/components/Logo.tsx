import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="ORVIONAR home"
      className={cn("inline-flex items-center gap-2.5 font-extrabold tracking-tight", className)}
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-[14px] bg-primary"
      >
        <span className="grid size-5 place-items-center rounded-full bg-white">
          <span className="size-2 rounded-full bg-primary" />
        </span>
      </span>
      <span className={cn("text-[1.35rem] leading-none", onDark ? "text-navy-foreground" : "text-ink")}>
        <span className="text-primary">OR</span>VIONAR
      </span>
    </Link>
  );
}
