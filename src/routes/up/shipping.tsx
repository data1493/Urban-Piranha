import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/shipping")({
  component: Shipping,
  head: () => ({ meta: [{ title: "Shipping & returns — Urban Piranha" }] }),
});

function Shipping() {
  return (
    <ShopPage kicker="Help" title="Shipping & returns">
      <p>
        Ground shipping is $8. Free at $100. We ship US, Canada, UK, Australia,
        New Zealand. Tickets print after Stripe confirms.
      </p>
      <p>
        Unworn items, tags on, 14 days. Fitteds and print are final sale. Start
        a return from Contact with your order id.
      </p>
      <p>
        Lost a ticket?{" "}
        <Link to="/up/track" className="text-up">
          Track your order
        </Link>{" "}
        or see the{" "}
        <Link to="/up/faq" className="text-up">
          FAQ
        </Link>
        .
      </p>
    </ShopPage>
  );
}
