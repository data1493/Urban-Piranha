import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

export function AuthSlot({ compact = false }: { compact?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-elevated" />;
  }
  if (user) return <UserButton />;
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className={cn(
          "inline-flex items-center rounded-full border border-line font-semibold tracking-wide text-fg uppercase hover:border-gold",
          compact ? "h-8 px-3 text-[10px]" : "h-9 px-4 text-[11px]",
        )}
      >
        Log in
      </Link>
      <Link
        to="/login"
        className={cn(
          "inline-flex items-center rounded-full border border-line font-semibold tracking-wide text-fg uppercase hover:border-purple hover:text-purple",
          compact ? "h-8 px-3 text-[10px]" : "h-9 px-4 text-[11px]",
        )}
      >
        Sign up
      </Link>
    </div>
  );
}
