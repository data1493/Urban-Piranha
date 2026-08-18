import type { InstantAnswer, WikiSummary } from "@/lib/types";
import { SafeImg } from "./SafeImg";

export function InstantPanel({
  instant,
  wiki,
}: {
  instant: InstantAnswer | null;
  wiki: WikiSummary | null;
}) {
  if (!instant && !wiki) return null;
  return (
    <div className="mb-6 grid gap-4">
      {instant && (
        <aside className="card border-gold/25">
          <p className="mb-1 text-[10px] tracking-[0.2em] text-gold uppercase">Instant</p>
          <h2 className="text-2xl font-bold text-fg">{instant.title}</h2>
          <p className="mt-2 text-sm text-muted">{instant.text}</p>
          {instant.image && (
            <SafeImg src={instant.image} alt="" className="mt-3 max-h-32 w-auto rounded-md" />
          )}
          {instant.url && (
            <a href={instant.url} className="mt-3 inline-block text-sm text-link hover:underline">
              Source
            </a>
          )}
        </aside>
      )}
      {wiki && (
        <aside className="card flex gap-4">
          {wiki.image && (
            <SafeImg
              src={wiki.image}
              alt=""
              className="hidden h-24 w-24 shrink-0 rounded-lg object-cover sm:block"
            />
          )}
          <div className="min-w-0">
            <p className="mb-1 text-[10px] tracking-[0.2em] text-purple uppercase">Wikipedia</p>
            <a href={wiki.url} className="text-lg font-semibold text-fg hover:text-link">
              {wiki.title}
            </a>
            {wiki.description && <p className="text-xs text-faint">{wiki.description}</p>}
            <p className="mt-2 line-clamp-4 text-sm text-muted">{wiki.extract}</p>
          </div>
        </aside>
      )}
    </div>
  );
}
