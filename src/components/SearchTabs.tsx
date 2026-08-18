import { Link } from "@tanstack/react-router";
import type { SearchTab } from "@/lib/types";
import { cn } from "@/lib/cn";

const TABS: { id: SearchTab; label: string }[] = [
  { id: "all", label: "Web" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "news", label: "News" },
];

export function SearchTabs({ q, active }: { q: string; active: SearchTab }) {
  return (
    <nav aria-label="Search categories" className="overflow-x-auto border-b border-line">
      <ul className="mx-auto flex max-w-5xl gap-6 px-4" role="tablist">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <li key={t.id}>
              <Link
                to="/search"
                search={{ q, tab: t.id, p: undefined }}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "relative block py-3 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive ? "text-gold" : "text-faint hover:text-fg",
                )}
              >
                {t.label}
                {isActive && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
