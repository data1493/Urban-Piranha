import { ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

export function PrivacyBadge({
  variant = "home",
  active = false,
}: {
  variant?: "home" | "header";
  active?: boolean;
}) {
  const isHeader = variant === "header";
  return (
    <Link
      to="/privacy"
      title="Privacy proof"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium transition-all",
        active
          ? "border-emerald/40 bg-emerald/15 text-emerald shadow-[0_0_8px_rgba(52,211,153,0.15)]"
          : "border-line bg-elevated text-muted hover:border-zinc-600",
        isHeader ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
      )}
    >
      <ShieldCheck className={cn("shrink-0", isHeader ? "size-3.5" : "size-4", active && "animate-pulse")} />
      <span>{active ? "encrypted on device · no trail" : "Privacy Protected"}</span>
    </Link>
  );
}
