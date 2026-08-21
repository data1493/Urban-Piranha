import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/about")({
  component: About,
  head: () => ({ meta: [{ title: "About — Urban Piranha" }] }),
});

function About() {
  return (
    <ShopPage kicker="The house" title="Urban Piranha">
      <p>
        We cut clothes the way a school moves — tight, no wasted motion. Black
        water. Silver flank. A red belly when it’s time to strike.
      </p>
      <p>
        U<sup>^</sup>P is a bite you can wear. Drop 01 is tees, 59FIFTYs, a
        deck, and print. Small runs. Then we cut the next.
      </p>
      <p>Ride urban. Live salty.</p>
      <Link to="/up" className="inline-flex h-11 items-center rounded-full bg-up px-5 text-sm font-semibold text-white">
        Shop the drop
      </Link>
    </ShopPage>
  );
}
