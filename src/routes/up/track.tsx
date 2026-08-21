import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { lookupOrder, type ShopOrder } from "@/lib/shop/api";
import { money } from "@/lib/shop/catalog";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/track")({
  component: Track,
  head: () => ({ meta: [{ title: "Track order — Urban Piranha" }] }),
});

function Track() {
  const [ticket, setTicket] = useState<ShopOrder | null | "empty">(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const row = await lookupOrder({
      data: {
        id: String(fd.get("id") ?? ""),
        email: String(fd.get("email") ?? ""),
      },
    });
    setTicket(row ?? "empty");
    setBusy(false);
  };

  return (
    <ShopPage kicker="Orders" title="Track your order">
      <p>Order id from the confirmation page plus the email you paid with.</p>
      <form className="grid gap-3 text-up-ink" onSubmit={onSubmit}>
        <input
          name="id"
          required
          placeholder="Order id (UP-…)"
          className="h-11 rounded-xl border border-up-line bg-white px-3 outline-none focus:border-up"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="h-11 rounded-xl border border-up-line bg-white px-3 outline-none focus:border-up"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-full bg-up text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Looking…" : "Find ticket"}
        </button>
      </form>
      {ticket === "empty" ? (
        <p>No ticket on that id and email.</p>
      ) : ticket ? (
        <div className="rounded-2xl border border-up-line bg-white p-5 text-up-ink">
          <p className="font-semibold">{ticket.id}</p>
          <p className="text-xs uppercase text-up-mute">{ticket.status}</p>
          <p className="mt-2 text-sm">
            {ticket.lines.map((l) => `${l.name} ×${l.qty}`).join(" · ")}
          </p>
          <p className="mt-2 text-sm font-semibold">{money(ticket.amountCents / 100)}</p>
        </div>
      ) : null}
      <p>
        Have an account? Tickets also live in{" "}
        <Link to="/up/account" className="text-up">
          Your account
        </Link>
        .
      </p>
    </ShopPage>
  );
}
