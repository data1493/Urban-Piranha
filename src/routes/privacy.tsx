import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { clearHistory, getHistory, getSettings } from "@/lib/privacy";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy · MetaH4" }] }),
});

function PrivacyPage() {
  const [count, setCount] = useState(0);
  const [settingsOn, setSettingsOn] = useState(false);

  useEffect(() => {
    setCount(getHistory().length);
    setSettingsOn(true);
    void getSettings();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      <BackgroundEffects variant="results" />
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="size-7 text-emerald" />
          <div>
            <h1 className="text-2xl font-bold">Privacy Protected</h1>
            <p className="font-graffiti text-sm text-purple/80">no accounts. no trail. no sale.</p>
          </div>
        </div>

        <div className="grid gap-3">
          <section className="card">
            <h2 className="text-sm font-semibold text-gold">What never happens</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>No search accounts. No login required to use Metah4.</li>
              <li>No cookies for ads, analytics, or retargeting.</li>
              <li>Queries are not stored on our servers as a profile.</li>
              <li>Location stays off until you tap Local results — then only that search is biased.</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-sm font-semibold text-gold">What stays on this device</h2>
            <p className="mt-2 text-sm text-muted">
              Recent searches ({count}) and your settings live in localStorage on this browser only.
              Clear them anytime. Nobody at Metah4 can read them.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg hover:border-gold"
              onClick={() => {
                clearHistory();
                setCount(0);
              }}
            >
              <Trash2 className="size-4" />
              Nuke local history
            </button>
            {settingsOn && (
              <p className="mt-3 text-xs text-faint">Settings key: metah4:settings · History key: metah4:history</p>
            )}
          </section>

          <section className="card">
            <h2 className="text-sm font-semibold text-gold">How a search is resolved</h2>
            <p className="mt-2 text-sm text-muted">
              This preview meta-searches public sources (DuckDuckGo Instant Answer, Wikipedia, Wikimedia
              Commons, Internet Archive, Hacker News). Production Metah4 at metah4.com routes through an
              encrypted Brave proxy so the plaintext query never sits on a log.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
