export type Size = "OS" | "S" | "M" | "L" | "XL" | "XXL";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: "tees" | "headwear" | "hardware" | "print";
  color: string;
  tagline: string;
  blurb: string;
  images: string[];
  sizes: Size[];
  badge?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "ride-urban-tee-black",
    name: "Ride Urban Tee",
    price: 48,
    category: "tees",
    color: "Black",
    tagline: "Ride urban. Live salty.",
    blurb:
      "Heavyweight black tee. Front piranha, back slogan. Cut for the street, the deck, and the night.",
    images: ["/brand/up/tee-black.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Core",
  },
  {
    slug: "ride-urban-tee-white",
    name: "Ride Urban Tee",
    price: 48,
    category: "tees",
    color: "White",
    tagline: "Ride urban. Live salty.",
    blurb: "White heavyweight tee. Black piranha mark and slogan. Clean enough for Sunday, salty enough for the rest.",
    images: ["/brand/up/tee-white.png", "/brand/up/tee-white-back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "bite-mark-tee",
    name: "Bite Mark Tee",
    price: 44,
    category: "tees",
    color: "White",
    tagline: "Small mark. Big bite.",
    blurb: "White tee with the piranha hit on the back. Quiet until you turn around.",
    images: ["/brand/up/tee-white-back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "piranha-59fifty",
    name: "Piranha 59FIFTY",
    price: 42,
    category: "headwear",
    color: "Black / Red",
    tagline: "Fitted. Fanged.",
    blurb: "Black New Era 59FIFTY. Piranha-wave embroidery and dripping URBAN PIRANHA wordmark.",
    images: ["/brand/up/hat-piranha.png"],
    sizes: ["OS"],
  },
  {
    slug: "wave-rhythm-59fifty",
    name: "Wave & Rhythm 59FIFTY",
    price: 42,
    category: "headwear",
    color: "Black / Gold",
    tagline: "Crowned for the issue.",
    blurb: "Collab fitted. Wave graphic and Wave & Rhythm crown — the magazine that rides with UP.",
    images: ["/brand/up/hat-wave.png"],
    sizes: ["OS"],
    badge: "Collab",
  },
  {
    slug: "urban-piranha-deck",
    name: "Urban Piranha Deck",
    price: 68,
    category: "hardware",
    color: "Black",
    tagline: "Graffiti fish. Real pop.",
    blurb: "7-ply maple. URBAN UP PIRANHA graphic, dripping type. Ride urban.",
    images: ["/brand/up/deck.png"],
    sizes: ["OS"],
  },
  {
    slug: "wave-rhythm-issue",
    name: "Wave & Rhythm — Summer Issue",
    price: 18,
    category: "print",
    color: "Print",
    tagline: "The culture on paper.",
    blurb: "Summer issue. UP on the cover, skate in the hand, salt in the air.",
    images: ["/brand/up/magazine.png"],
    sizes: ["OS"],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "headwear", label: "Headwear" },
  { id: "hardware", label: "Decks" },
  { id: "print", label: "Print" },
] as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function money(n: number) {
  return `$${n.toFixed(0)}`;
}
