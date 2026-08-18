import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-line bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-purple uppercase">
          Find. Stream. Discover.
        </p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
          <Link to="/about" className="hover:text-fg">
            About
          </Link>
          <Link to="/privacy" className="hover:text-fg">
            Privacy
          </Link>
          <Link to="/settings" className="hover:text-fg">
            Settings
          </Link>
          <Link to="/up" className="font-semibold text-up-bright hover:text-fg">
            Urban Piranha
          </Link>
          <a href="mailto:metah4searchengine@proton.me" className="hover:text-fg">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
