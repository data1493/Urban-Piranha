import { createFileRoute, Link } from "@tanstack/react-router";
import { AudioLines, Brain, Crown, Mic, Search } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/vex")({
  component: VexPage,
  head: () => ({
    meta: [
      { title: "DJ VEX — The AI Voice of MetaH4" },
      { name: "description", content: "DJ VEX is the AI voice of MetaH4. Search with hip hop flavor." },
    ],
  }),
});

const FEATURES = [
  { icon: AudioLines, title: "Search with VEX", body: "Ask like you talk. Get answers with hip hop flavor." },
  { icon: Search, title: "Real-time results", body: "Culture and the open web, ranked for signal." },
  { icon: Brain, title: "AI curated", body: "Filtered by DJ VEX for quality and truth." },
  { icon: Crown, title: "Hip hop first", body: "Built for the culture. By the culture." },
];

function VexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-purple uppercase">
            Introducing
          </p>
          <h1 className="font-display mt-2 text-6xl leading-none text-fg sm:text-8xl">DJ VEX</h1>
          <p className="mt-2 text-sm font-semibold tracking-wide text-purple uppercase">
            The AI voice of MetaH4
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            Powered by advanced AI. Curated by hip hop culture. DJ VEX delivers real results with
            bars, beats & knowledge. Tap the mic on the subway and talk to the engine.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-purple px-5 text-sm font-semibold text-fg hover:bg-purple-deep"
            >
              <Mic className="size-4" />
              Talk on the subway
            </Link>
            <Link
              to="/search"
              search={{ q: "DJ VEX", tab: "all", p: undefined }}
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-fg hover:border-gold"
            >
              Search with VEX
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f.title} className="card">
                <f.icon className="size-5 text-purple" />
                <p className="mt-2 text-sm font-semibold text-fg">{f.title}</p>
                <p className="mt-1 text-xs text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-8 rounded-full bg-purple/30 blur-3xl" />
          <img
            src="/brand/subway/dj-vex.jpg"
            alt="DJ VEX, the AI voice of MetaH4"
            className="relative w-full rounded-3xl object-cover"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
