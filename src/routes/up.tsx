import { Outlet, createFileRoute } from "@tanstack/react-router";
import { UpFooter, UpHeader } from "@/components/shop/UpChrome";
import { CartProvider } from "@/lib/shop/cart";

export const Route = createFileRoute("/up")({
  component: UpLayout,
  head: () => ({
    meta: [
      { title: "Urban Piranha — Ride Urban. Live Salty." },
      {
        name: "description",
        content: "Urban Piranha official shop. Tees, fitteds, decks. Ride urban. Live salty.",
      },
    ],
  }),
});

function UpLayout() {
  return (
    <CartProvider>
      <div className="up-shop flex min-h-screen flex-col">
        <UpHeader />
        <Outlet />
        <UpFooter />
      </div>
    </CartProvider>
  );
}
