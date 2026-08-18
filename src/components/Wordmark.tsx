import { cn } from "@/lib/cn";

const SIZES = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl sm:text-7xl",
  hero: "text-5xl sm:text-7xl lg:text-8xl",
} as const;

export function Wordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex flex-nowrap items-baseline whitespace-nowrap leading-none tracking-wide",
        SIZES[size],
        className,
      )}
    >
      <span className="text-gold">META</span>
      <span className="text-fg">H</span>
      <span className="font-graffiti text-purple -ml-0.5 inline-block -rotate-2">4</span>
    </span>
  );
}

export function Tagline({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.42em] text-purple uppercase sm:text-sm",
        className,
      )}
    >
      The Hip Hop Search Engine
    </p>
  );
}
