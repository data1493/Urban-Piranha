import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, PRODUCTS, money, type Product } from "@/lib/shop/catalog";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/up/")({
  component: ShopHome,
});

function ShopHome() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]["id"]>("all");
  const items = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <main className="flex-1">
      <section className="border-b border-up-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] text-up uppercase">
              Official shop
            </p>
            <h1 className="font-display mt-3 text-6xl leading-[0.9] text-up-ink sm:text-8xl">
              Ride urban.
              <br />
              <span className="text-up">Live salty.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-up-mute sm:text-base">
              Streetwear from the water and the block. Tees, 59FIFTYs, decks. Same world as
              MetaH4 — different bite.
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

      <section id="drop" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-4xl text-up-ink">The drop</h2>
            <p className="mt-1 text-sm text-up-mute">In stock. Ships from the coast.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={cn(
                  "h-9 rounded-full border px-4 text-xs font-semibold tracking-wide uppercase",
                  cat === c.id
                    ? "border-up bg-up text-white"
                    : "border-up-line bg-white text-up-ink hover:border-up",
                )}
              >
                {c.label}
              </button>
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

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/up/product/$slug"
      params={{ slug: product.slug }}
      className="group block overflow-hidden rounded-2xl border border-up-line bg-white hover:border-up"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-up-mist">
        <img
          src={product.images[0]}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-up px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="px-4 py-4">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-up uppercase">
          {product.color}
        </p>
        <p className="mt-1 text-sm font-semibold text-up-ink">{product.name}</p>
        <p className="mt-1 text-sm text-up-mute">{money(product.price)}</p>
      </div>
    </Link>
  );
}
