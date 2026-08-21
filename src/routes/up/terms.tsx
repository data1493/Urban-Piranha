import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/terms")({
  component: Terms,
  head: () => ({ meta: [{ title: "Terms — Urban Piranha" }] }),
});

function Terms() {
  return (
    <ShopPage kicker="Legal" title="Terms">
      <p>
        Buying a drop is a sale of goods. Colors shift on screens. Fitteds and
        print are final. Tees may be returned unworn in 14 days.
      </p>
      <p>
        Prices are USD. Shipping is extra unless the bag hits $100. We can
        refuse orders that look automated or abusive.
      </p>
      <p>California law. Urban Piranha Clothing Company, 2026.</p>
    </ShopPage>
  );
}
