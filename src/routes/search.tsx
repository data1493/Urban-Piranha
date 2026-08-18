import { createFileRoute } from "@tanstack/react-router";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { ImageGrid } from "@/components/ImageGrid";
import { InstantPanel } from "@/components/InstantPanel";
import { NewsList } from "@/components/NewsList";
import { RelatedQueries } from "@/components/RelatedQueries";
import { ResultCard } from "@/components/ResultCard";
import { SearchTabs } from "@/components/SearchTabs";
import { VideoGrid } from "@/components/VideoGrid";
import { performSearch } from "@/lib/search.functions";
import type { SearchTab } from "@/lib/types";

function asTab(v: unknown): SearchTab {
  return v === "images" || v === "videos" || v === "news" ? v : "all";
}

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: String(s.q ?? ""),
    tab: asTab(s.tab),
    p: Number(s.p) > 1 ? Number(s.p) : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q, tab: search.tab, p: search.p ?? 1 }),
  loader: ({ deps }) => performSearch({ data: deps }),
  component: SearchPage,
  pendingComponent: SearchPending,
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.query ? `${loaderData.query} · MetaH4` : "Search · MetaH4" }],
  }),
});

function SearchPending() {
  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader variant="search" />
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-28">
            <div className="skeleton mb-3 h-3 w-32" />
            <div className="skeleton mb-2 h-5 w-3/4" />
            <div className="skeleton h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPage() {
  const data = Route.useLoaderData();
  const { q, tab } = Route.useSearch();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-bg">
      <BackgroundEffects variant="results" />
      <SiteHeader variant="search" query={q} tab={tab} />
      <SearchTabs q={q} active={tab} />
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-5 pb-20">
        {!q.trim() && (
          <EmptyState title="Type something" body="Your query never becomes a profile. Search when you're ready." />
        )}

        {q.trim() && tab === "all" && (
          <>
            <InstantPanel instant={data.instant} wiki={data.wiki} />
            {data.results.length === 0 ? (
              <EmptyState
                title="No trail, no hits"
                body="Nothing came back for that query. Try a simpler phrase."
              />
            ) : (
              <div className="grid gap-3">
                {data.results.map((r, i) => (
                  <ResultCard key={r.url + i} result={r} index={i} />
                ))}
              </div>
            )}
            <RelatedQueries items={data.related} />
          </>
        )}

        {tab === "images" &&
          (data.images.length ? (
            <ImageGrid images={data.images} />
          ) : (
            <EmptyState title="No images" body="Wikimedia didn't return stills for that query." />
          ))}

        {tab === "videos" &&
          (data.videos.length ? (
            <VideoGrid videos={data.videos} />
          ) : (
            <EmptyState title="No videos" body="Archive.org was quiet on this one." />
          ))}

        {tab === "news" &&
          (data.news.length ? (
            <NewsList news={data.news} />
          ) : (
            <EmptyState title="No news" body="No recent stories matched. Try a broader term." />
          ))}
      </main>
      <Footer />
    </div>
  );
}
