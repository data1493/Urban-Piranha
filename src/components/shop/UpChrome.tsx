import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/shop/cart";
import { searchProducts } from "@/lib/shop/catalog";
import { cn } from "@/lib/cn";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function UpLogo({ className }: { className?: string }) {
  return (
    <img
      src="/brand/up/logo-mark.png"
      alt="Urban Piranha"
      className={cn("h-12 w-auto object-contain sm:h-14", className)}
    />
  );
}

const SHOP_LINKS = [
  { label: "New drop", to: "/up" as const, search: { cat: "all" } },
  { label: "Tees", to: "/up" as const, search: { cat: "tees" } },
  { label: "Headwear", to: "/up" as const, search: { cat: "headwear" } },
  { label: "Decks", to: "/up" as const, search: { cat: "hardware" } },
  { label: "Print", to: "/up" as const, search: { cat: "print" } },
];

export function UpHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const locked = open || searchOpen;
    document.body.classList.toggle("overflow-hidden", locked);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open, searchOpen]);

  return (
    <header className="relative sticky top-0 z-40 border-b border-up-line bg-up-paper/95 backdrop-blur-md">
      <p className="bg-up px-3 py-1.5 text-center text-[10px] font-semibold tracking-[0.14em] text-white uppercase sm:tracking-[0.18em] sm:text-[11px]">
        <span className="sm:hidden">Free shipping $100+ · Drop 01</span>
        <span className="hidden sm:inline">Free shipping $100+ · Drop 01 live · Pay with Stripe</span>
      </p>
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-4">
        <div className="flex items-center justify-start">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-up-ink hover:bg-up-mist"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => {
              setSearchOpen(false);
              setOpen((v) => !v);
            }}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <Link to="/up" aria-label="Urban Piranha home" className="justify-self-center">
          <UpLogo className="h-10 sm:h-12" />
        </Link>

        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-up-ink hover:bg-up-mist"
            aria-label="Search"
            onClick={() => {
              setOpen(false);
              setSearchOpen((v) => !v);
            }}
          >
            <Search className="size-5" />
          </button>
          <AccountIcon />
          <Link
            to="/up/cart"
            className="relative inline-flex size-11 items-center justify-center rounded-full text-up-ink hover:bg-up-mist"
            aria-label={`Bag, ${count} items`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-up px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {open ? <FullMenu onClose={() => setOpen(false)} onSearch={() => { setOpen(false); setSearchOpen(true); }} /> : null}
      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </header>
  );
}

function FullMenu({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  return (
    <div className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-100%)] overflow-y-auto bg-up-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-8 pb-28 sm:grid-cols-2 lg:grid-cols-4">
        <MenuCol title="Shop">
          {SHOP_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              search={l.search}
              onClick={onClose}
              className="block py-2.5 font-display text-3xl tracking-wide text-up-ink hover:text-up"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onSearch}
            className="mt-2 block py-2.5 text-left text-base text-up-mute hover:text-up"
          >
            Search the drop
          </button>
        </MenuCol>

        <MenuCol title="Your account">
          <SignedIn>
            <Link
              to="/up/account"
              onClick={onClose}
              className="block py-2.5 text-lg font-semibold text-up-ink hover:text-up"
            >
              Orders & profile
            </Link>
            {authEnabled ? <SignOutLink onDone={onClose} /> : null}
          </SignedIn>
          <SignedOut>
            <Link
              to="/login"
              onClick={onClose}
              className="block py-2.5 text-lg font-semibold text-up-ink hover:text-up"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              onClick={onClose}
              className="block py-2.5 text-lg text-up-mute hover:text-up"
            >
              Create account
            </Link>
          </SignedOut>
          <Link to="/up/track" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Track your order
          </Link>
          <Link to="/up/cart" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Bag
          </Link>
        </MenuCol>

        <MenuCol title="Help">
          <Link to="/up/size-guide" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Size guide
          </Link>
          <Link to="/up/shipping" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Shipping & returns
          </Link>
          <Link to="/up/faq" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            FAQ
          </Link>
          <Link to="/up/contact" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Contact
          </Link>
        </MenuCol>

        <MenuCol title="The house">
          <Link to="/up/about" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            About
          </Link>
          <Link to="/up/privacy" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Privacy
          </Link>
          <Link to="/up/terms" onClick={onClose} className="block py-2.5 text-lg text-up-ink hover:text-up">
            Terms
          </Link>
          <p className="mt-6 text-xs leading-relaxed text-up-mute">
            Ride urban. Live salty. Limited drops. Stripe checkout.
          </p>
        </MenuCol>
      </div>
    </div>
  );
}

function SignOutLink({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signOut()
          .then(onDone)
          .catch(() => setBusy(false));
      }}
      className="block py-2.5 text-left text-lg text-up-mute hover:text-up disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hits = searchProducts(q);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-100%)] overflow-y-auto bg-up-paper">
      <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
        <label className="flex items-center gap-3 rounded-full border border-up-line bg-white px-4">
          <Search className="size-4 shrink-0 text-up-mute" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tees, hats, decks…"
            className="h-12 flex-1 bg-transparent text-sm text-up-ink outline-none"
            aria-label="Search the shop"
          />
          <button type="button" onClick={onClose} className="text-sm text-up-mute hover:text-up-ink">
            Close
          </button>
        </label>
        <ul className="mt-6 divide-y divide-up-line border-y border-up-line">
          {hits.length === 0 ? (
            <li className="py-8 text-sm text-up-mute">Nothing in this drop matches.</li>
          ) : (
            hits.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/up/product/$slug"
                  params={{ slug: p.slug }}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 hover:bg-up-mist"
                >
                  <img src={p.images[0]} alt="" className="size-16 rounded-lg object-contain bg-up-mist" />
                  <span>
                    <span className="block text-sm font-semibold text-up-ink">{p.name}</span>
                    <span className="block text-xs text-up-mute">
                      {p.color} · ${p.price}
                    </span>
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function MenuCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function AccountIcon() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-11 animate-pulse rounded-full bg-up-mist" />;
  }
  return (
    <Link
      to={user ? "/up/account" : "/login"}
      className="inline-flex size-11 items-center justify-center rounded-full text-up-ink hover:bg-up-mist"
      aria-label={user ? "Your account" : "Sign in"}
    >
      {user?.profileImageUrl ? (
        <img src={user.profileImageUrl} alt="" className="size-7 rounded-full object-cover" />
      ) : (
        <UserRound className="size-5" />
      )}
    </Link>
  );
}

export function UpFooter() {
  return (
    <footer className="mt-auto border-t border-up-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <UpLogo className="h-10" />
          <p className="mt-3 text-xs font-semibold tracking-[0.22em] text-up uppercase">
            Ride urban. Live salty.
          </p>
          <p className="mt-3 max-w-xs text-sm text-up-mute">
            Streetwear from the water and the block. Limited drops. Stripe checkout.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-up-ink uppercase">Shop</p>
          <div className="mt-3 grid gap-2 text-sm text-up-mute">
            <Link to="/up" className="hover:text-up-ink">
              The drop
            </Link>
            <Link to="/up" search={{ cat: "tees" }} className="hover:text-up-ink">
              Tees
            </Link>
            <Link to="/up" search={{ cat: "headwear" }} className="hover:text-up-ink">
              Headwear
            </Link>
            <Link to="/up" search={{ cat: "hardware" }} className="hover:text-up-ink">
              Decks
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-up-ink uppercase">Help</p>
          <div className="mt-3 grid gap-2 text-sm text-up-mute">
            <Link to="/up/account" className="hover:text-up-ink">
              Your account
            </Link>
            <Link to="/up/track" className="hover:text-up-ink">
              Track order
            </Link>
            <Link to="/up/size-guide" className="hover:text-up-ink">
              Size guide
            </Link>
            <Link to="/up/shipping" className="hover:text-up-ink">
              Shipping & returns
            </Link>
            <Link to="/up/faq" className="hover:text-up-ink">
              FAQ
            </Link>
            <Link to="/up/contact" className="hover:text-up-ink">
              Contact
            </Link>
          </div>
        </div>
        <NewsletterForm />
      </div>
      <div className="border-t border-up-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-up-mute sm:flex-row sm:justify-between">
          <p>© 2026 Urban Piranha Clothing Company</p>
          <div className="flex gap-4">
            <Link to="/up/privacy" className="hover:text-up-ink">
              Privacy
            </Link>
            <Link to="/up/terms" className="hover:text-up-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-up-ink uppercase">The list</p>
      <p className="mt-3 text-sm text-up-mute">Drops first. No spam. Chimp mail from the house.</p>
      {done ? (
        <p className="mt-4 text-sm font-semibold text-up">You’re on the list.</p>
      ) : (
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            const { subscribeNewsletter } = await import("@/lib/shop/api");
            const res = await subscribeNewsletter({ data: email });
            if (res.ok) setDone(true);
            else setErr(res.error);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-11 rounded-full border border-up-line bg-up-paper px-4 text-sm outline-none focus:border-up"
          />
          <button
            type="submit"
            className="h-11 rounded-full bg-up text-sm font-semibold text-white hover:bg-up-bright"
          >
            Join
          </button>
          {err ? <p className="text-xs text-red-600">{err}</p> : null}
        </form>
      )}
    </div>
  );
}
