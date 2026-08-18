import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { AuthSlot } from "./AuthSlot";
import { SearchBar } from "./SearchBar";
import { Wordmark } from "./Wordmark";
import { MORE_LINKS, TOP_LINKS } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function SiteHeader({
  variant = "home",
  query = "",
  tab = "all",
}: {
  variant?: "home" | "search";
  query?: string;
  tab?: string;
}) {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const isSearch = variant === "search";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link to="/" aria-label="MetaH4 home" className="shrink-0" onClick={() => setOpen(false)}>
          <Wordmark size="sm" />
        </Link>

        {isSearch ? (
          <div className="min-w-0 flex-1">
            <SearchBar initialQuery={query} variant="header" tab={tab} />
          </div>
        ) : (
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex" aria-label="Primary">
            {TOP_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase hover:text-purple"
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase hover:text-purple"
                onClick={() => setMore((v) => !v)}
              >
                More <ChevronDown className="size-3" />
              </button>
              {more ? (
                <div className="absolute top-full right-0 z-50 mt-2 min-w-40 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-2xl">
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
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <AuthSlot compact={isSearch} />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-fg lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-line px-4 py-3 lg:hidden" aria-label="Mobile">
          <ul className="grid gap-1">
            {TOP_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  search={item.search}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-fg hover:bg-elevated"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {MORE_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-medium text-muted hover:bg-elevated hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
