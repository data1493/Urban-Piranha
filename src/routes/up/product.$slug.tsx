import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { getProduct, money, relatedProducts, type Size } from "@/lib/shop/catalog";
import { useCart } from "@/lib/shop/cart";
import { ProductSpin } from "@/components/shop/ProductSpin";
import { HatViewer } from "@/components/shop/hat/HatViewer";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/up/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.product.name ?? "Product"} — Urban Piranha` }],
  }),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const cart = useCart();
  const [size, setSize] = useState<Size>(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);
  const dark = product.category === "headwear";
  const more = relatedProducts(product.slug, 3);

  const add = () => {
    cart.add(product.slug, size, qty);
    setAdded(true);
  };

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-8 pb-28 lg:grid-cols-2 lg:py-10 lg:pb-10">
      <div>
        {product.viewer === "hat3d" ? (
          <HatViewer />
        ) : product.spin ? (
          <ProductSpin frames={product.spin} alt={product.name} dark={dark} face={shot} />
        ) : (
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-up-line",
              dark ? "bg-black" : "bg-up-mist",
            )}
          >
            <img
              src={product.images[shot] ?? product.images[0]}
              alt={product.name}
              className="aspect-4/5 w-full object-contain"
            />
          </div>
        )}
        {product.images.length > 1 ? (
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setShot(i)}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded-lg border",
                  dark ? "bg-black" : "bg-up-mist",
                  i === shot ? "border-up" : "border-up-line",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">{product.color}</p>
        <h1 className="font-display mt-2 text-4xl text-up-ink sm:text-5xl">{product.name}</h1>
        <p className="mt-2 text-lg font-semibold text-up-ink">{money(product.price)}</p>
        <p className="mt-4 text-sm leading-relaxed text-up-mute">{product.blurb}</p>

        <fieldset className="mt-8">
          <legend className="flex w-full items-center justify-between text-xs font-semibold tracking-wide text-up-ink uppercase">
            <span>{product.sizes[0] === "OS" ? "Size — one size" : "Size"}</span>
            <Link to="/up/size-guide" className="font-medium normal-case tracking-normal text-up">
              Size guide
            </Link>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "h-11 min-w-11 rounded-full border px-3 text-sm font-semibold",
                  size === s
                    ? "border-up bg-up text-white"
                    : "border-up-line bg-white text-up-ink hover:border-up",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex items-center gap-3">
          <p className="text-xs font-semibold tracking-wide text-up-ink uppercase">Qty</p>
          <div className="flex items-center rounded-full border border-up-line">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              className="grid size-11 place-items-center"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((n) => Math.min(12, n + 1))}
              className="grid size-11 place-items-center"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
          <button
            type="button"
            onClick={add}
            className="inline-flex h-12 items-center rounded-full bg-up px-8 text-sm font-semibold text-white hover:bg-up-bright"
          >
            {added ? "Added — keep going" : "Add to bag"}
          </button>
          {added ? (
            <Link
              to="/up/cart"
              className="inline-flex h-12 items-center rounded-full border border-up-line px-6 text-sm font-semibold text-up-ink hover:border-up"
            >
              View bag
            </Link>
          ) : null}
        </div>

        <p className="mt-6 text-xs text-up-mute">{product.tagline} · Free shipping $100+.</p>

        <div className="mt-8 divide-y divide-up-line border-y border-up-line text-sm">
          <details className="group py-3" open>
            <summary className="cursor-pointer list-none font-semibold text-up-ink [&::-webkit-details-marker]:hidden">
              Details
            </summary>
            <ul className="mt-2 grid gap-1 text-up-mute">
              {(product.details ?? [product.blurb]).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer list-none font-semibold text-up-ink [&::-webkit-details-marker]:hidden">
              Shipping & returns
            </summary>
            <p className="mt-2 text-up-mute">
              Ground $8, free at $100. 3–7 days from the coast. Unworn tees, tags on, 14
              days. Fitteds and print are final sale.
            </p>
          </details>
        </div>
      </div>

      {more.length ? (
        <section className="lg:col-span-2">
          <h2 className="font-display text-3xl text-up-ink">Also in the drop</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/up/product/$slug"
                  params={{ slug: p.slug }}
                  className="block overflow-hidden rounded-2xl border border-up-line bg-white hover:border-up"
                >
                  <div
                    className={cn(
                      "aspect-4/5",
                      p.category === "headwear" ? "bg-black" : "bg-up-mist",
                    )}
                  >
                    <img src={p.images[0]} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-sm font-semibold text-up-ink">{p.name}</p>
                    <p className="text-xs text-up-mute">{money(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-up-line bg-up-paper/95 p-3 backdrop-blur-md lg:hidden">
        {added ? (
          <Link
            to="/up/cart"
            className="flex h-12 w-full items-center justify-center rounded-full bg-up text-sm font-semibold text-white"
          >
            View bag
          </Link>
        ) : (
          <button
            type="button"
            onClick={add}
            className="h-12 w-full rounded-full bg-up text-sm font-semibold text-white"
          >
            Add to bag · {money(product.price * qty)}
          </button>
        )}
      </div>
    </main>
  );
}
