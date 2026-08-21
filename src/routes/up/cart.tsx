import { Link, createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { FREE_SHIPPING_AT, PRODUCTS, getProduct, money, shippingFor } from "@/lib/shop/catalog";
import { useCart } from "@/lib/shop/cart";

export const Route = createFileRoute("/up/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Bag — Urban Piranha" }] }),
});

function CartPage() {
  const cart = useCart();
  const shipping = shippingFor(cart.subtotal);
  const remain = Math.max(0, FREE_SHIPPING_AT - cart.subtotal);
  const progress = Math.min(100, (cart.subtotal / FREE_SHIPPING_AT) * 100);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="font-display text-5xl text-up-ink">Your bag</h1>
      {cart.lines.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-up-mute">Nothing in the bag yet.</p>
          <Link
            to="/up"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-up px-5 text-sm font-semibold text-white"
          >
            Shop the drop
          </Link>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link
                  to="/up/product/$slug"
                  params={{ slug: p.slug }}
                  className="block overflow-hidden rounded-2xl border border-up-line bg-white"
                >
                  <img src={p.images[0]} alt="" className="aspect-4/5 w-full object-contain bg-up-mist" />
                  <p className="px-3 py-3 text-sm font-semibold text-up-ink">{p.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-up-line bg-white p-4">
            <p className="text-sm text-up-ink">
              {remain > 0 ? (
                <>
                  Add <span className="font-semibold text-up">{money(remain)}</span> for free shipping.
                </>
              ) : (
                <span className="font-semibold text-up">Free shipping unlocked.</span>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-up-mist">
              <div className="h-full rounded-full bg-up" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="mt-6 divide-y divide-up-line border-y border-up-line">
            {cart.lines.map((line) => {
              const p = getProduct(line.slug);
              if (!p) return null;
              return (
                <li key={`${line.slug}-${line.size}`} className="flex gap-4 py-5">
                  <Link
                    to="/up/product/$slug"
                    params={{ slug: p.slug }}
                    className="h-28 w-24 shrink-0 overflow-hidden rounded-lg border border-up-line bg-white"
                  >
                    <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/up/product/$slug"
                      params={{ slug: p.slug }}
                      className="text-sm font-semibold text-up-ink hover:text-up"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-1 text-xs text-up-mute">
                      {p.color} · {line.size}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-up-ink">{money(p.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => cart.setQty(line.slug, line.size, line.qty - 1)}
                        className="grid size-11 place-items-center rounded-full border border-up-line"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">{line.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => cart.setQty(line.slug, line.size, line.qty + 1)}
                        className="grid size-11 place-items-center rounded-full border border-up-line"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => cart.remove(line.slug, line.size)}
                        className="ml-2 grid size-11 place-items-center text-up-mute hover:text-up-ink"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-up-mute">
                Shipping {shipping === 0 ? "Free" : money(shipping)}
              </p>
              <p className="text-lg font-semibold text-up-ink">
                Total <span className="text-up">{money(cart.subtotal + shipping)}</span>
              </p>
            </div>
            <Link
              to="/up/checkout"
              className="inline-flex h-12 items-center justify-center rounded-full bg-up px-8 text-sm font-semibold text-white hover:bg-up-bright"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
