import { Link } from "@tanstack/react-router";
import { SearchBar } from "./SearchBar";
import { PrivacyBadge } from "./PrivacyBadge";
import { LocationToggle } from "./LocationToggle";

export function Header({ query = "", tab = "all" }: { query?: string; tab?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
        <Link to="/" aria-label="Return to homepage" className="shrink-0 hover:opacity-80">
          <img src="/images/logo2a.png" alt="METAH4" className="h-12 md:h-14" />
        </Link>
        <div className="min-w-0 flex-1">
          <SearchBar initialQuery={query} variant="header" tab={tab} />
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <LocationToggle />
          <PrivacyBadge variant="header" active={Boolean(query)} />
        </div>
      </div>
    </header>
  );
}
