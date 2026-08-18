import type { NewsHit } from "@/lib/types";
import { relativeTime } from "@/lib/format";

export function NewsList({ news }: { news: NewsHit[] }) {
  return (
    <div className="grid gap-3">
      {news.map((n) => (
        <a key={n.url} href={n.url} target="_blank" rel="noopener noreferrer" className="card block">
          <div className="mb-1 flex items-center gap-2 text-[11px] text-faint">
            <span className="text-gold">{n.source}</span>
            {n.published && (
              <>
                <span>·</span>
                <time>{relativeTime(n.published)}</time>
              </>
            )}
          </div>
          <h3 className="text-base font-semibold text-fg">{n.title}</h3>
          {n.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{n.excerpt}</p>}
        </a>
      ))}
    </div>
  );
}
