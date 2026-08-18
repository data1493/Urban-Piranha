import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  AudioLines,
  Mic,
  Settings,
  ShoppingCart,
  SprayCan,
  TrendingUp,
  X,
} from "lucide-react";
import { TRENDING } from "@/lib/nav";

const SHOUT_KEY = "metah4:shoutouts";

export function QuickActions({ onMic }: { onMic: () => void }) {
  const router = useRouter();
  const [spray, setSpray] = useState(false);
  const [trend, setTrend] = useState(false);
  const [note, setNote] = useState("");

  const post = () => {
    const text = note.trim();
    if (!text) return;
    const prev = readShouts();
    localStorage.setItem(SHOUT_KEY, JSON.stringify([{ text, at: Date.now() }, ...prev].slice(0, 20)));
    setNote("");
    setSpray(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          to="/vex"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-semibold tracking-wide text-fg uppercase hover:border-purple"
        >
          <AudioLines className="size-3.5 text-purple" />
          AI Voice: DJ VEX
        </Link>
        <button
          type="button"
          onClick={onMic}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-semibold tracking-wide text-fg uppercase hover:border-purple"
        >
          <Mic className="size-3.5 text-purple" />
          Open mic
        </button>
        <button
          type="button"
          onClick={() => setSpray(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-semibold tracking-wide text-fg uppercase hover:border-gold"
        >
          <SprayCan className="size-3.5 text-gold" />
          Spray a shoutout
        </button>
        <button
          type="button"
          onClick={() => setTrend((v) => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-semibold tracking-wide text-fg uppercase hover:border-gold"
        >
          <TrendingUp className="size-3.5 text-gold" />
          Trending topics
        </button>
        <Link
          to="/settings"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-semibold tracking-wide text-fg uppercase hover:border-line"
        >
          <Settings className="size-3.5" />
          Settings
        </Link>
      </div>

      {trend ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {TRENDING.map((term) => (
            <button
              key={term}
              type="button"
              className="rounded-full border border-line bg-elevated px-3 py-1.5 text-xs text-muted hover:border-gold hover:text-fg"
              onClick={() =>
                router.navigate({ to: "/search", search: { q: term, tab: "all", p: undefined } })
              }
            >
              {term}
            </button>
          ))}
        </div>
      ) : null}

      {spray ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl text-fg">Spray a shoutout</p>
              <button type="button" aria-label="Close" onClick={() => setSpray(false)}>
                <X className="size-5 text-muted" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">Local only. This stays on your machine.</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={140}
              rows={3}
              placeholder="Tag the car..."
              className="mt-3 w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={post}
              className="mt-3 h-10 w-full rounded-full bg-gold text-sm font-semibold text-bg"
            >
              Hit the wall
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function readShouts(): { text: string; at: number }[] {
  try {
    const raw = localStorage.getItem(SHOUT_KEY);
    return raw ? (JSON.parse(raw) as { text: string; at: number }[]) : [];
  } catch {
    return [];
  }
}

export function UpBanner() {
  return (
    <Link
      to="/up"
      className="up-banner flex items-center gap-4 rounded-xl bg-bg px-4 py-3 hover:border-ember"
    >
      <ShoppingCart className="size-8 shrink-0 text-ember" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold tracking-[0.14em] text-fg uppercase sm:text-base">
          Urban Piranha Clothing Company
        </span>
        <span className="block text-[11px] font-semibold tracking-[0.16em] text-ember uppercase">
          Official streetwear brand · Shop now on MetaH4
        </span>
      </span>
      <span className="text-xl text-ember">›</span>
    </Link>
  );
}

export function PickOfDay() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() =>
        router.navigate({
          to: "/search",
          search: { q: 'Air Jordan 1 Retro High OG "Court Purple"', tab: "all", p: undefined },
        })
      }
      className="flex w-full items-center gap-3 rounded-xl border border-purple/40 bg-surface p-3 text-left hover:border-purple sm:max-w-xs"
    >
      <img
        src="/brand/subway/jordan.jpg"
        alt=""
        className="size-16 shrink-0 rounded-lg object-cover"
      />
      <span>
        <span className="block text-[10px] font-semibold tracking-[0.16em] text-purple uppercase">
          DJ VEX's pick of the day
        </span>
        <span className="mt-1 block text-xs font-semibold text-fg">
          Air Jordan 1 Retro High OG “Court Purple”
        </span>
        <span className="mt-1 block text-[10px] text-muted uppercase">View details →</span>
      </span>
    </button>
  );
}

export function VexFloat() {
  return (
    <Link to="/vex" className="group relative inline-flex items-end gap-2">
      <span className="mb-6 hidden rounded-xl border border-purple/50 bg-surface px-3 py-2 text-xs text-fg sm:block">
        Yo, I'm DJ Vex.
        <br />
        Tap me anytime.
      </span>
      <img
        src="/brand/subway/vex-bubble.jpg"
        alt="DJ VEX"
        className="size-20 rounded-full object-cover ring-2 ring-purple group-hover:ring-gold sm:size-24"
      />
    </Link>
  );
}
