import type { SearchResult } from "@/lib/types";
import { getSettings } from "@/lib/privacy";

export function ResultCard({ result, index }: { result: SearchResult; index: number }) {
  const newTab = typeof window === "undefined" ? true : getSettings().newTab;
  return (
    <article
      className="card animate-bounce-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <img
          src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=16`}
          alt=""
          className="size-4 rounded-sm"
          loading="lazy"
        />
        <span className="truncate font-mono text-xs text-faint">{result.domain}</span>
        {result.isLocal && (
          <span className="rounded-full bg-purple/15 px-2 py-0.5 text-[10px] font-medium text-purple">
            Local
          </span>
        )}
      </div>
      <a
        href={result.url}
        target={newTab ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="mb-2 block text-lg leading-snug font-semibold break-words text-link hover:text-blue-300"
      >
        {result.title}
      </a>
      {result.description && (
        <p className="text-sm leading-relaxed text-muted">{result.description}</p>
      )}
    </article>
  );
}
