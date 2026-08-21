import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Truck, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CATEGORIES, PRODUCTS, money, type CategoryId, type Product } from "@/lib/shop/catalog";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/up/")({
  validateSearch: (s: Record<string, unknown>): { cat?: string } => {
    const cat = typeof s.cat === "string" ? s.cat : undefined;
    return cat ? { cat } : {};
  },
  component: ShopHome,
  head: () => ({ meta: [{ title: "Shop — Urban Piranha" }] }),
});

function ShopHome() {
  const search = Route.useSearch();
  const initial = (CATEGORIES.some((c) => c.id === search.cat) ? search.cat : "all") as CategoryId;
  const [cat, setCat] = useState<CategoryId>(initial);

  useEffect(() => {
    setCat(initial);
  }, [initial]);

  const items = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <main className="flex-1">
      <section className="border-b border-up-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] text-up uppercase">
              Official shop · Drop 01
            </p>
            <h1 className="font-display mt-3 text-5xl leading-[0.9] text-up-ink sm:text-8xl">
              Ride urban.
              <br />
              <span className="text-up">Live salty.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-up-mute sm:text-base">
              Streetwear from the water and the block. Tees, 59FIFTYs, decks. Limited
              drops. Paid on Stripe.
            </p>
            <a
              href="#drop"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-up px-6 text-sm font-semibold text-white hover:bg-up-bright"
            >
              Shop the drop
            </a>
          </div>
          <div className="grid place-items-center">
            <img
              src="/brand/up/logo.png"
              alt="UP Urban Piranha"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-up-line bg-up-paper">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-3">
          <Trust
            icon={<Truck className="size-4" />}
            title="3–7 day ship"
            text="Ground from the coast. Free at $100."
          />
          <Trust
            icon={<ShieldCheck className="size-4" />}
            title="Stripe checkout"
            text="Card on Stripe. Guest is fine."
          />
          <Trust
            icon={<Undo2 className="size-4" />}
            title="14-day returns"
            text="Unworn tees, tags on. Fitteds final."
          />
        </div>
      </section>

      <section id="drop" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-4xl text-up-ink">The drop</h2>
            <p className="mt-1 text-sm text-up-mute">In stock. Ships from the coast.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/up"
                search={{ cat: c.id }}
                onClick={() => setCat(c.id)}
                className={cn(
                  "inline-flex h-10 items-center rounded-full border px-4 text-xs font-semibold tracking-wide uppercase",
                  cat === c.id
                    ? "border-up bg-up text-white"
                    : "border-up-line bg-white text-up-ink hover:border-up",
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Trust({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 place-items-center rounded-full bg-white text-up">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-up-ink">{title}</p>
        <p className="text-xs text-up-mute">{text}</p>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/up/product/$slug"
      params={{ slug: product.slug }}
      className="group block overflow-hidden rounded-2xl border border-up-line bg-white hover:border-up"
    >
      <div
        className={cn(
          "relative aspect-4/5 overflow-hidden",
          product.category === "headwear" ? "bg-black" : "bg-up-mist",
        )}
      >
        <img
          src={product.images[0]}
          alt=""
          className={cn(
            "h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]",
            product.category === "headwear" ? "bg-black" : "bg-up-mist",
          )}
        />
        {product.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-up px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="px-4 py-4">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-up uppercase">{product.color}</p>
        <p className="mt-1 text-sm font-semibold text-up-ink">{product.name}</p>
        <p className="mt-1 text-sm text-up-mute">{money(product.price)}</p>
      </div>
    </Link>
  );
}
