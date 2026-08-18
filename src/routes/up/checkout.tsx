import { Link, createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { getProduct, money } from "@/lib/shop/catalog";
import { useCart } from "@/lib/shop/cart";

export const Route = createFileRoute("/up/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — Urban Piranha" }] }),
});

function CheckoutPage() {
  const cart = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart.lines.length) return;
    const data = new FormData(e.currentTarget);
    const id = `UP-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      address: String(data.get("address") ?? ""),
      city: String(data.get("city") ?? ""),
      zip: String(data.get("zip") ?? ""),
      lines: cart.lines,
      total: cart.subtotal,
      at: Date.now(),
    };
    const prev = JSON.parse(localStorage.getItem("up:orders") || "[]") as unknown[];
    localStorage.setItem("up:orders", JSON.stringify([order, ...prev].slice(0, 30)));
    cart.clear();
    setOrderId(id);
  };

  if (orderId) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16 text-center">
        <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">Locked in</p>
        <h1 className="font-display mt-2 text-5xl text-up-ink">Order {orderId}</h1>
        <p className="mt-4 text-sm text-up-mute">
          Ride urban. Live salty. We saved the ticket — you'll get a ping when it ships.
        </p>
        <Link
          to="/up"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-up px-6 text-sm font-semibold text-white"
        >
          Keep shopping
        </Link>
      </main>
    );
  }

  if (!cart.lines.length) {
    return (
      <main className="mx-auto max-w-lg flex-1 px-4 py-16 text-center">
        <p className="text-sm text-up-mute">Bag is empty.</p>
        <Link to="/up" className="mt-4 inline-flex text-sm font-semibold text-up">
          Shop the drop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-4 py-10 lg:grid-cols-[1fr_18rem]">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <h1 className="font-display text-5xl text-up-ink">Checkout</h1>
        <label className="grid gap-1 text-sm">
          <span className="text-up-mute">Name</span>
          <input
            name="name"
            required
            className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-up-mute">Email</span>
          <input
            name="email"
            type="email"
            required
            className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-up-mute">Address</span>
          <input
            name="address"
            required
            className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="text-up-mute">City</span>
            <input
              name="city"
              required
              className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-up-mute">ZIP</span>
            <input
              name="zip"
              required
              className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-2 h-12 rounded-full bg-up text-sm font-semibold text-white hover:bg-up-bright"
        >
          Place order · {money(cart.subtotal)}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-up-line bg-white p-5">
        <p className="text-xs font-semibold tracking-wide text-up-mute uppercase">Bag</p>
        <ul className="mt-3 grid gap-3">
          {cart.lines.map((line) => {
            const p = getProduct(line.slug);
            if (!p) return null;
            return (
              <li key={`${line.slug}-${line.size}`} className="flex justify-between gap-3 text-sm">
                <span className="text-up-ink">
                  {p.name}{" "}
                  <span className="text-up-mute">
                    ×{line.qty} · {line.size}
                  </span>
                </span>
                <span className="font-semibold">{money(p.price * line.qty)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 border-t border-up-line pt-3 text-sm font-semibold text-up-ink">
          Total {money(cart.subtotal)}
        </p>
      </aside>
    </main>
  );
}
