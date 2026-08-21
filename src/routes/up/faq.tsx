import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/faq")({
  component: Faq,
  head: () => ({ meta: [{ title: "FAQ — Urban Piranha" }] }),
});

const ITEMS = [
  {
    q: "How do I pay?",
    a: "Stripe Checkout. Card. Guest is fine — no account required. Sign in if you want tickets on Your account.",
  },
  {
    q: "When does it ship?",
    a: "Drops leave the coast in 3–7 business days after Stripe confirms.",
  },
  {
    q: "What does shipping cost?",
    a: "Ground is $8. Free at $100. We ship US, Canada, UK, Australia, New Zealand.",
  },
  {
    q: "What’s the return policy?",
    a: "Unworn tees, tags on, 14 days. Fitteds, decks, and print are final sale. Start a return from Contact with your order id.",
  },
  {
    q: "How do I find my size?",
    a: "Tees are a boxy street cut — if you sit between sizes, size up. 59FIFTYs in this drop are one size (OS).",
  },
  {
    q: "Where’s my order?",
    a: "Track with your order id and email, or sign in — Your account lists tickets on that email.",
  },
  {
    q: "Do you restock?",
    a: "Small runs. If it’s gone, join the list. Next cut is next cut.",
  },
  {
    q: "Wholesale / press?",
    a: "Write us from Contact. Keep it short.",
  },
];

function Faq() {
  return (
    <ShopPage kicker="Help" title="FAQ">
      <dl className="space-y-6">
        {ITEMS.map((item) => (
          <div key={item.q}>
            <dt className="font-semibold text-up-ink">{item.q}</dt>
            <dd className="mt-1">{item.a}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          to="/up/track"
          className="inline-flex h-11 items-center rounded-full border border-up-line px-5 text-sm font-semibold text-up-ink"
        >
          Track order
        </Link>
        <Link
          to="/up/contact"
          className="inline-flex h-11 items-center rounded-full bg-up px-5 text-sm font-semibold text-white"
        >
          Contact
        </Link>
      </div>
    </ShopPage>
  );
}
