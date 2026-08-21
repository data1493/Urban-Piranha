import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyOrders, type ShopOrder } from "@/lib/shop/api";
import { money } from "@/lib/shop/catalog";

export const Route = createFileRoute("/up/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Your account — Urban Piranha" }] }),
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [orders, setOrders] = useState<ShopOrder[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="h-10 w-48 animate-pulse rounded-md bg-up-mist" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <p className="text-[11px] font-bold tracking-[0.22em] text-up uppercase">Account</p>
      <h1 className="font-display mt-2 text-5xl text-up-ink">Your house</h1>
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-up-line bg-white p-5">
        <UserButton />
      </div>
      <p className="mt-3 text-sm text-up-mute">
        {user.primaryEmail ?? "Signed in"} · orders follow this account and this email.
      </p>

      <h2 className="font-display mt-12 text-3xl text-up-ink">Orders</h2>
      {orders === null ? (
        <p className="mt-4 text-sm text-up-mute">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="mt-4">
          <p className="text-sm text-up-mute">No tickets yet.</p>
          <Link
            to="/up"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-up px-5 text-sm font-semibold text-white"
          >
            Shop the drop
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-up-line border-y border-up-line">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div>
                <p className="font-semibold text-up-ink">{o.id}</p>
                <p className="text-xs text-up-mute uppercase">{o.status}</p>
                <p className="mt-1 text-sm text-up-mute">
                  {o.lines.map((l) => `${l.name} ×${l.qty}`).join(" · ")}
                </p>
              </div>
              <p className="text-sm font-semibold">{money(o.amountCents / 100)}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
