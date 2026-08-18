import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { DEFAULT_SETTINGS, getSettings, setSettings } from "@/lib/privacy";
import type { Settings } from "@/lib/types";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings · MetaH4" }] }),
});

function SettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setS(getSettings());
  }, []);

  function update(patch: Partial<Settings>) {
    setS(setSettings(patch));
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      <BackgroundEffects variant="results" />
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <p className="mb-6 text-sm text-muted">Saved only on this device. Never synced.</p>

        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          <Row label="Theme" hint="Dark is the Metah4 default.">
            <select
              value={s.theme}
              onChange={(e) => update({ theme: e.target.value as Settings["theme"] })}
              className="rounded-full border border-line bg-bg px-3 py-1.5 text-sm"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </Row>
          <Row label="Open links in a new tab">
            <Toggle on={s.newTab} onChange={(v) => update({ newTab: v })} />
          </Row>
          <Row label="Save search history locally">
            <Toggle on={s.saveHistory} onChange={(v) => update({ saveHistory: v })} />
          </Row>
          <Row label="Safe search" hint="Filters obviously adult terms from the query.">
            <Toggle on={s.safeSearch} onChange={(v) => update({ safeSearch: v })} />
          </Row>
          <Row label="Region bias">
            <select
              value={s.region}
              onChange={(e) => update({ region: e.target.value })}
              className="rounded-full border border-line bg-bg px-3 py-1.5 text-sm"
            >
              <option value="us">United States</option>
              <option value="gb">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
            </select>
          </Row>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-faint">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn("h-6 w-11 rounded-full transition-colors", on ? "bg-purple" : "bg-line")}
    >
      <span
        className={cn(
          "block size-5 translate-y-0.5 rounded-full bg-white transition-transform",
          on ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
