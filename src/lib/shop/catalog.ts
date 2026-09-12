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
  category: "tees" | "hoodies" | "headwear" | "hardware" | "extras" | "print";
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
  {
    slug: "wordmark-hoodie-black",
    name: "Wordmark Hoodie",
    price: 78,
    category: "hoodies",
    color: "Black",
    tagline: "Heavy fleece. Gothic UP.",
    blurb:
      "Black pullover hoodie. Chest gothic Urban UP Piranha wordmark. Pocket, hood, and salt.",
    images: ["/brand/up/drop02/hoodie.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "New",
    details: [
      "Heavyweight fleece pullover",
      "Kangaroo pocket + drawcord hood",
      "Front gothic Urban UP Piranha mark",
      "Machine wash cold, hang dry",
    ],
  },
  {
    slug: "wordmark-tee-white",
    name: "Wordmark Tee",
    price: 48,
    category: "tees",
    color: "White",
    tagline: "Gothic mark. Clean field.",
    blurb:
      "White heavyweight tee with the black gothic Urban UP Piranha wordmark across the chest.",
    images: ["/brand/up/drop02/tee.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "New",
    details: [
      "Heavyweight cotton",
      "Boxy street cut",
      "Chest gothic wordmark",
      "Machine wash cold, hang dry",
    ],
  },
  {
    slug: "wordmark-dad-cap",
    name: "Wordmark Dad Cap",
    price: 36,
    category: "headwear",
    color: "Black",
    tagline: "Low profile. High bite.",
    blurb: "Unstructured black cap. Embroidered gothic Urban UP Piranha across the front.",
    images: ["/brand/up/drop02/cap.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    badge: "New",
    details: [
      "Unstructured dad cap",
      "Adjustable strap",
      "Front embroidered wordmark",
      "One size",
    ],
  },
  {
    slug: "wordmark-mug",
    name: "Wordmark Mug",
    price: 18,
    category: "extras",
    color: "White",
    tagline: "11 oz. Salt optional.",
    blurb: "White ceramic mug. Black gothic Urban UP Piranha wrap.",
    images: ["/brand/up/drop02/mug.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    badge: "New",
    details: ["Ceramic, 11 oz", "Dishwasher safe", "Printed both sides"],
  },
  {
    slug: "wordmark-stein",
    name: "Wordmark Stein",
    price: 24,
    category: "extras",
    color: "Clear",
    tagline: "Glass. Heavy handle.",
    blurb: "Clear glass stein. Gothic Urban UP Piranha on the face.",
    images: ["/brand/up/drop02/stein.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    badge: "New",
    details: ["Heavy glass stein", "Hand wash recommended", "Not for the dishwasher every night"],
  },
  {
    slug: "wordmark-tote",
    name: "Wordmark Tote",
    price: 32,
    category: "extras",
    color: "Natural",
    tagline: "Canvas that works.",
    blurb: "Natural canvas tote. Black gothic Urban UP Piranha on the front panel.",
    images: ["/brand/up/drop02/tote.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    badge: "New",
    details: ["Heavy canvas", "Shoulder straps", "Inner pocket"],
  },
  {
    slug: "wordmark-pouch",
    name: "Wordmark Pouch",
    price: 22,
    category: "extras",
    color: "Natural",
    tagline: "Zip. Carry. Bite.",
    blurb: "Natural canvas zip pouch. Gothic wordmark on the face.",
    images: ["/brand/up/drop02/pouch.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    badge: "New",
    details: ["Canvas zip pouch", "Lined", "Fits keys, cash, small kit"],
  },
  {
    slug: "wordmark-shopper",
    name: "Wordmark Shopper",
    price: 14,
    category: "extras",
    color: "Black",
    tagline: "The bag the drop comes in.",
    blurb: "Matte black paper shopper with rope handles and the gothic UP mark.",
    images: ["/brand/up/drop02/bag.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    details: ["Matte black paper", "Rope handles", "Gift wrap energy"],
  },
  {
    slug: "wordmark-sticker",
    name: "Wordmark Sticker",
    price: 6,
    category: "extras",
    color: "White / Black",
    tagline: "Die-cut. Weatherproof.",
    blurb: "Die-cut gothic Urban UP Piranha sticker. Slap it on a deck, a bottle, a door.",
    images: ["/brand/up/drop02/sticker.jpg", "/brand/up/drop02/lineup-sheet.jpg"],
    sizes: ["OS"],
    badge: "New",
    details: ["Die-cut vinyl", "Weatherproof", "Pack of 1 this drop"],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "tees", label: "Tees" },
  { id: "hoodies", label: "Hoodies" },
  { id: "headwear", label: "Headwear" },
  { id: "hardware", label: "Decks" },
  { id: "extras", label: "Extras" },
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
    hoodie: "hoodies",
    hoodies: "hoodies",
    fleece: "hoodies",
    skate: "hardware",
    board: "hardware",
    deck: "hardware",
    mag: "print",
    magazine: "print",
    mug: "extras",
    tote: "extras",
    sticker: "extras",
    pouch: "extras",
    bag: "extras",
    stein: "extras",
    extras: "extras",
    merch: "extras",
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
