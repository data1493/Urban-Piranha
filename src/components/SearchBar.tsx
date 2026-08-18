import { useRouter } from "@tanstack/react-router";
import { Mic, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getHistory, pushHistory } from "@/lib/privacy";
import { suggestQueries } from "@/lib/search.functions";
import { cn } from "@/lib/cn";

export function SearchBar({
  initialQuery = "",
  variant = "home",
  tab = "all",
  onMic,
}: {
  initialQuery?: string;
  variant?: "home" | "header" | "subway";
  tab?: string;
  onMic?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHeader = variant === "header";
  const isSubway = variant === "subway";

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setHints(getHistory().slice(0, 6).map((h) => h.q));
      return;
    }
    const handle = window.setTimeout(() => {
      suggestQueries({ data: { q } })
        .then(setHints)
        .catch(() => setHints([]));
    }, 180);
    return () => window.clearTimeout(handle);
  }, [q]);

  const go = useCallback(
    (value: string) => {
      const next = value.trim();
      if (!next) return;
      pushHistory(next);
      setOpen(false);
      router.navigate({
        to: "/search",
        search: { q: next, tab: tab === "images" || tab === "videos" || tab === "news" ? tab : "all", p: undefined },
      });
    },
    [router, tab],
  );

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        role="search"
        aria-label="Web search"
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
      >
        <label htmlFor={isHeader ? "header-search" : "home-search"} className="sr-only">
          Search query
        </label>
        <div
          className={cn(
            "flex items-center border bg-elevated transition-all focus-within:ring-1",
            isSubway
              ? "rounded-full border-purple/50 px-3 py-1.5 focus-within:border-purple focus-within:ring-purple/40"
              : isHeader
                ? "rounded-full border-line px-3 py-1 focus-within:border-gold focus-within:ring-gold/40"
                : "rounded-full border-line px-4 py-2.5 focus-within:border-gold focus-within:ring-gold/40",
          )}
        >
          {isSubway ? (
            <button
              type="button"
              aria-label="Open mic"
              onClick={onMic}
              className="mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-purple hover:bg-purple/15"
            >
              <Mic className="size-5" />
            </button>
          ) : (
            <Search
              className={cn("shrink-0 text-faint", isHeader ? "mr-2 size-4" : "mr-3 size-5")}
              aria-hidden
            />
          )}
          <input
            ref={inputRef}
            id={isHeader ? "header-search" : "home-search"}
            name="q"
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={
              isSubway
                ? "Search the web with DJ VEX..."
                : isHeader
                  ? "Search MetaH4..."
                  : "Search music, lyrics, videos, artists, news and more..."
            }
            autoComplete="off"
            className={cn(
              "min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-faint",
              isHeader ? "py-1 text-sm" : "text-base",
            )}
          />
          {isSubway ? (
            <img
              src="/brand/subway/vex-avatar.jpg"
              alt=""
              className="mr-2 hidden size-10 rounded-full object-cover ring-2 ring-purple sm:block"
            />
          ) : null}
          <button
            type="submit"
            disabled={!q.trim()}
            aria-label="Submit search"
            className={cn(
              "shrink-0 rounded-full bg-purple font-semibold text-fg transition-colors hover:bg-purple-deep disabled:cursor-not-allowed disabled:opacity-30",
              isHeader ? "ml-2 px-4 py-1 text-xs" : "ml-1 px-6 py-2 text-sm",
            )}
          >
            GO
          </button>
        </div>
      </form>

      {open && hints.length > 0 && (
        <ul className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          {hints.map((h) => (
            <li key={h}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-fg hover:bg-elevated"
                onClick={() => {
                  setQ(h);
                  go(h);
                }}
              >
                <Search className="size-3.5 text-faint" />
                {h}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function listenMic(onText: (text: string) => void): boolean {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return false;
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.onresult = (e) => {
    const text = e.results[0]?.[0]?.transcript ?? "";
    if (text) onText(text);
  };
  rec.start();
  return true;
}

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((e: { results: Array<Array<{ transcript: string }>> }) => void) | null;
};
