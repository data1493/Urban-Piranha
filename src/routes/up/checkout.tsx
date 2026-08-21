import { Link, createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { getProduct, money, shippingFor } from "@/lib/shop/catalog";
import { useCart } from "@/lib/shop/cart";
import { createCheckout, stripeStatus } from "@/lib/shop/api";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/up/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — Urban Piranha" }] }),
});

function CheckoutPage() {
  const cart = useCart();
  const user = useCurrentUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stripeReady, setStripeReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.displayName) setName((n) => n || user.displayName || "");
    if (user?.primaryEmail) setEmail((e) => e || user.primaryEmail || "");
  }, [user]);

  useEffect(() => {
    stripeStatus()
      .then((s) => setStripeReady(s.ready))
      .catch(() => setStripeReady(false));
  }, []);

  const shipping = shippingFor(cart.subtotal);
  const total = cart.subtotal + shipping;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart.lines.length) return;
    setBusy(true);
    setError("");
    try {
      const res = await createCheckout({
        data: {
          origin: window.location.origin,
          email,
          name,
          subscribe,
          lines: cart.lines,
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      if (res.orderId) {
        cart.clear();
        window.location.href = `/up/thanks?order=${res.orderId}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  };

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
        <p className="text-sm text-up-mute">
          {stripeReady
            ? "Stripe takes the card. Address and phone on the next screen. Guest is fine."
            : "Preview pay is on until Stripe is connected. Same order ticket either way."}
        </p>
        <label className="grid gap-1 text-sm">
          <span className="text-up-mute">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-up-mute">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-up-line bg-white px-3 text-up-ink outline-none focus:border-up"
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-up-mute">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
            className="mt-1 size-4 accent-up"
          />
          Put me on the drop list (Mailchimp via Chimp Sheets).
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 h-12 rounded-full bg-up text-sm font-semibold text-white hover:bg-up-bright disabled:opacity-60"
        >
          {busy ? "Sending you through…" : stripeReady ? `Pay ${money(total)} · Stripe` : `Place order · ${money(total)}`}
        </button>
        <p className="text-xs text-up-mute">
          Guest checkout is fine. Sign in if you want the ticket on{" "}
          <Link to="/login" className="text-up">
            your account
          </Link>
          .
        </p>
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
        <p className="mt-3 flex justify-between text-sm text-up-mute">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : money(shipping)}</span>
        </p>
        <p className="mt-3 border-t border-up-line pt-3 text-sm font-semibold text-up-ink">
          Total {money(total)}
        </p>
      </aside>
    </main>
  );
}
