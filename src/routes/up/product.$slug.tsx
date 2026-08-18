import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, money, type Size } from "@/lib/shop/catalog";
import { useCart } from "@/lib/shop/cart";
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
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);

  const add = () => {
    cart.add(product.slug, size, 1);
    setAdded(true);
  };

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-10 lg:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-2xl border border-up-line bg-white">
          <img
            src={product.images[shot] ?? product.images[0]}
            alt={product.name}
            className="aspect-4/5 w-full object-cover"
          />
        </div>
        {product.images.length > 1 ? (
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setShot(i)}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded-lg border",
                  i === shot ? "border-up" : "border-up-line",
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">{product.color}</p>
        <h1 className="font-display mt-2 text-5xl text-up-ink">{product.name}</h1>
        <p className="mt-2 text-lg font-semibold text-up-ink">{money(product.price)}</p>
        <p className="mt-4 text-sm leading-relaxed text-up-mute">{product.blurb}</p>

        <fieldset className="mt-8">
          <legend className="text-xs font-semibold tracking-wide text-up-ink uppercase">
            {product.sizes[0] === "OS" ? "Size — one size" : "Size"}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "h-10 min-w-10 rounded-full border px-3 text-sm font-semibold",
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

        <div className="mt-8 flex flex-wrap gap-3">
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

        <p className="mt-6 text-xs text-up-mute">{product.tagline}</p>
      </div>
    </main>
  );
}
