import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/shop/cart";
import { cn } from "@/lib/cn";

export function UpLogo({ className }: { className?: string }) {
  return (
    <img
      src="/brand/up/logo-mark.png"
      alt="Urban Piranha"
      className={cn("h-12 w-auto object-contain sm:h-14", className)}
    />
  );
}

export function UpHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-up-line bg-up-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/up" aria-label="Urban Piranha home" className="shrink-0" onClick={() => setOpen(false)}>
          <UpLogo className="h-11 sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-semibold tracking-[0.18em] text-up-ink uppercase md:flex">
          <Link to="/up" className="hover:text-up">
            Shop
          </Link>
          <a href="/up#drop" className="hover:text-up">
            The drop
          </a>
          <Link to="/" className="hover:text-up">
            MetaH4
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/up/cart"
            className="relative inline-flex size-10 items-center justify-center rounded-full text-up-ink hover:bg-up-mist"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-up px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-up-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-up-line px-4 py-3 md:hidden">
          <Link to="/up" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-up-ink">
            Shop
          </Link>
          <Link to="/up/cart" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-up-ink">
            Cart
          </Link>
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-sm text-up-mute">
            Back to MetaH4
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

export function UpFooter() {
  return (
    <footer className="mt-auto border-t border-up-line bg-up-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <UpLogo className="h-10" />
          <p className="mt-2 text-xs font-semibold tracking-[0.22em] text-up uppercase">
            Ride urban. Live salty.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-xs text-up-mute">
          <Link to="/up" className="hover:text-up-ink">
            Shop
          </Link>
          <Link to="/up/cart" className="hover:text-up-ink">
            Cart
          </Link>
          <Link to="/" className="hover:text-up-ink">
            MetaH4
          </Link>
          <a href="mailto:metah4searchengine@proton.me" className="hover:text-up-ink">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
