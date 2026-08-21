import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/shop/cart";
import { fulfillStripeSession, getOrderById, type ShopOrder } from "@/lib/shop/api";
import { money } from "@/lib/shop/catalog";

export const Route = createFileRoute("/up/thanks")({
  validateSearch: (s: Record<string, unknown>) => ({
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
    order: typeof s.order === "string" ? s.order : undefined,
  }),
  component: ThanksPage,
  head: () => ({ meta: [{ title: "Order locked — Urban Piranha" }] }),
});

function ThanksPage() {
  const { session_id, order } = Route.useSearch();
  const cart = useCart();
  const [ticket, setTicket] = useState<ShopOrder | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    cart.clear();
    let live = true;
    (async () => {
      try {
        if (session_id) {
          const paid = await fulfillStripeSession({ data: session_id });
          if (live) setTicket(paid);
          return;
        }
        if (order) {
          const row = await getOrderById({ data: order });
          if (live) setTicket(row);
        }
      } catch {
        if (live) setErr("We’re locking the ticket — check your email in a minute.");
      }
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session_id, order]);

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16 text-center">
      <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">Locked in</p>
      <h1 className="font-display mt-2 text-5xl text-up-ink">
        {ticket ? `Order ${ticket.id}` : "Thank you"}
      </h1>
      <p className="mt-4 text-sm text-up-mute">
        Ride urban. Live salty. Stripe has the card. Chimp Sheets takes the sale to
        mail and the sheet.
      </p>
      {ticket ? (
        <p className="mt-3 text-sm font-semibold text-up-ink">
          {money(ticket.amountCents / 100)} · {ticket.status}
        </p>
      ) : err ? (
        <p className="mt-3 text-sm text-up-mute">{err}</p>
      ) : (
        <p className="mt-3 text-sm text-up-mute">Writing the ticket…</p>
      )}
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          to="/up"
          className="inline-flex h-11 items-center rounded-full bg-up px-6 text-sm font-semibold text-white"
        >
          Keep shopping
        </Link>
        <Link to="/up/account" className="text-sm text-up-mute hover:text-up-ink">
          Your account
        </Link>
      </div>
    </main>
  );
}
