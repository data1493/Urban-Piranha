export const SHIPPING_USD = 8;
export const FREE_SHIPPING_AT = 100;

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_USD;
}

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
  spin?: string[];
  viewer?: "hat3d";
  details?: string[];
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
    images: ["/brand/up/tee-black-front.png", "/brand/up/tee-black-back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Core",
    spin: ["/brand/up/tee-black-front.png", "/brand/up/tee-black-back.png"],
    details: [
      "10 oz heavyweight cotton",
      "Boxy street cut — size up if you sit between",
      "Front piranha, back Ride Urban. Live Salty.",
      "Machine wash cold, hang dry",
    ],
  },
  {
    slug: "ride-urban-tee-white",
    name: "Ride Urban Tee",
    price: 48,
    category: "tees",
    color: "White",
    tagline: "Ride urban. Live salty.",
    blurb:
      "White heavyweight tee. Front: black piranha. Back: Ride Urban. Live Salty. Same shirt, two shots.",
    images: ["/brand/up/tee-white.png", "/brand/up/tee-white-back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: [
      "10 oz heavyweight cotton",
      "Boxy street cut — size up if you sit between",
      "Front black piranha, back slogan",
      "Machine wash cold, hang dry",
    ],
  },
  {
    slug: "piranha-59fifty",
    name: "Piranha 59FIFTY",
    price: 42,
    category: "headwear",
    color: "Black / Red",
    tagline: "Fitted. Fanged.",
    blurb:
      "Black New Era 59FIFTY. Piranha-wave embroidery and dripping URBAN PIRANHA wordmark.",
    images: ["/brand/up/hat-piranha-front.png", "/brand/up/hat-piranha-side.png"],
    sizes: ["OS"],
    viewer: "hat3d",
    spin: ["/brand/up/hat-piranha-front.png", "/brand/up/hat-piranha-side.png"],
    details: [
      "New Era 59FIFTY fitted",
      "Structured crown, flat visor",
      "Embroidered piranha + dripping wordmark",
      "One size this drop (OS) — final sale",
    ],
  },
  {
    slug: "wave-rhythm-59fifty",
    name: "Wave & Rhythm 59FIFTY",
    price: 42,
    category: "headwear",
    color: "Black / Gold",
    tagline: "Crowned for the issue.",
    blurb:
      "Collab fitted. Wave graphic and Wave & Rhythm crown — the magazine that rides with UP.",
    images: ["/brand/up/hat-wave.png"],
    sizes: ["OS"],
    badge: "Collab",
    details: [
      "New Era 59FIFTY fitted",
      "Wave & Rhythm collab crown",
      "One size this drop (OS) — final sale",
    ],
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
    details: [
      "7-ply maple",
      "8.25\" street shape",
      "Grip not included",
      "Final sale",
    ],
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
    details: ["Print magazine", "Ships flat", "Final sale"],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "headwear", label: "Headwear" },
  { id: "hardware", label: "Decks" },
  { id: "print", label: "Print" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function money(n: number) {
  return `$${n.toFixed(0)}`;
}

export function searchProducts(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return PRODUCTS;
  const aliases: Record<string, string> = {
    hat: "headwear",
    hats: "headwear",
    cap: "headwear",
    fitted: "headwear",
    shirt: "tees",
    tee: "tees",
    tshirt: "tees",
    skate: "hardware",
    board: "hardware",
    deck: "hardware",
    mag: "print",
    magazine: "print",
  };
  const cat = aliases[n];
  return PRODUCTS.filter((p) => {
    if (cat && p.category === cat) return true;
    const hay = `${p.name} ${p.tagline} ${p.color} ${p.category} ${p.blurb} ${p.slug}`.toLowerCase();
    return hay.includes(n);
  });
}

export function relatedProducts(slug: string, n = 3) {
  const p = getProduct(slug);
  const rest = PRODUCTS.filter((x) => x.slug !== slug);
  if (!p) return rest.slice(0, n);
  return [...rest.filter((x) => x.category === p.category), ...rest.filter((x) => x.category !== p.category)].slice(
    0,
    n,
  );
}
