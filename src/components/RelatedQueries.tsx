import { Link } from "@tanstack/react-router";

export function RelatedQueries({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-8">
      <p className="mb-3 text-xs tracking-widest text-faint uppercase">Related</p>
      <div className="flex flex-wrap gap-2">
        {items.map((q) => (
          <Link
            key={q}
            to="/search"
            search={{ q, tab: "all", p: undefined }}
            className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted hover:border-purple/50 hover:text-fg"
          >
            {q}
          </Link>
        ))}
      </div>
    </div>
  );
}
