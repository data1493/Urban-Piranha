import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { AdvertiseCard, SubwayStage } from "@/components/SubwayStage";
import { AuthSlot } from "@/components/AuthSlot";
import { PickOfDay, QuickActions, UpBanner, VexFloat } from "@/components/HomeDock";
import { SearchBar, listenMic } from "@/components/SearchBar";
import { Tagline, Wordmark } from "@/components/Wordmark";
import { MORE_LINKS, TOP_LINKS } from "@/lib/nav";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "MetaH4 — The Hip Hop Search Engine" },
      {
        name: "description",
        content: "The hip hop search engine. Find. Stream. Discover. Powered by DJ VEX.",
      },
    ],
  }),
});

function HomePage() {
  const searchHost = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);

  const onMic = () => {
    const ok = listenMic((text) => {
      const input = searchHost.current?.querySelector("input");
      if (input instanceof HTMLInputElement) {
        const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        proto?.set?.call(input, text);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.form?.requestSubmit();
      }
    });
    if (!ok) searchHost.current?.querySelector("input")?.focus();
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="px-4 pt-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
            {TOP_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase hover:text-purple"
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase hover:text-purple"
                onClick={() => setMore((v) => !v)}
              >
                More <ChevronDown className="size-3" />
              </button>
              {more ? (
                <div className="absolute top-full left-0 z-50 mt-2 min-w-40 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-2xl">
                  {MORE_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMore(false)}
                      className="block px-3 py-2 text-sm text-fg hover:bg-elevated"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <AuthSlot />
        </div>
        {open ? (
          <nav className="mt-2 grid gap-1 border-t border-line py-2 md:hidden" aria-label="Mobile">
            {[...TOP_LINKS, ...MORE_LINKS].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={"search" in item ? item.search : undefined}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-fg hover:bg-elevated"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-4 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <Link to="/" aria-label="MetaH4 home" className="inline-block">
              <Wordmark size="hero" />
            </Link>
            <Tagline className="mt-2" />
          </div>
          <div className="w-full max-w-md lg:w-96">
            <AdvertiseCard />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pt-4 pb-6 sm:px-4">
        <SubwayStage />

        <div ref={searchHost} className="mx-auto mt-4 w-full max-w-3xl">
          <SearchBar variant="subway" onMic={onMic} />
        </div>

        <div className="mt-3">
          <QuickActions onMic={onMic} />
        </div>

        <div className="mt-4 grid items-end gap-3 md:grid-cols-[auto_1fr_auto]">
          <PickOfDay />
          <UpBanner />
          <div className="flex justify-end">
            <VexFloat />
          </div>
        </div>
      </main>

      <footer className="px-4 pb-4 text-center">
        <p className="text-xs font-semibold tracking-[0.38em] text-purple uppercase">
          Find. Stream. Discover.
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-faint">
          <span>Powered by Brave Search</span>
          <span>© 2026 metah4.com All rights reserved</span>
          <Link to="/privacy" className="hover:text-fg">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
