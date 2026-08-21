import Stripe from "stripe";
import { getSessionUser } from "@/lib/auth/verify.server";
import { expandLines, totalsFor, upsertPaidOrder, addNewsletter, type OrderLine } from "./orders.server";
import type { Size } from "./catalog";

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function safeOrigin(origin: string) {
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    const h = u.hostname;
    if (
      h === "localhost" ||
      h === "127.0.0.1" ||
      h.endsWith(".grok-sandbox.com") ||
      h.endsWith(".vercel.app") ||
      h === "urbanpiranhaclothingcompany.com" ||
      h.endsWith(".urbanpiranhaclothingcompany.com")
    ) {
      return u.origin;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function cartKey(lines: OrderLine[]) {
  return lines.map((l) => `${l.slug}:${l.size}:${l.qty}`).join(",");
}

function chimpMeta(extra: Record<string, string> = {}) {
  const chimpOwner = process.env.CHIMP_SHEETS_OWNER_ID ?? "";
  return {
    source: "urban-piranha",
    brand: "UP",
    ...extra,
    ...(chimpOwner ? { user_id: chimpOwner } : {}),
  };
}

export async function createCheckoutSession(data: {
  origin: string;
  email: string;
  name: string;
  subscribe?: boolean;
  lines: { slug: string; size: Size; qty: number }[];
}) {
  const lines = expandLines(data.lines);
  if (!lines.length) return { ok: false as const, error: "Bag is empty." };
  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();
  if (!email || !name) return { ok: false as const, error: "Name and email are required." };

  const { shipping, total } = totalsFor(lines);
  let userId: string | null = null;
  try {
    userId = (await getSessionUser())?.id ?? null;
  } catch {
    userId = null;
  }

  if (data.subscribe) {
    await addNewsletter(email);
  }

  const origin = safeOrigin(data.origin) ?? "http://127.0.0.1:8080";
  const stripe = stripeClient();

  if (!stripe) {
    const order = await upsertPaidOrder({
      userId,
      email,
      name,
      status: "preview",
      amountCents: Math.round(total * 100),
      shippingCents: Math.round(shipping * 100),
      lines,
    });
    return { ok: true as const, preview: true as const, orderId: order.id, url: null };
  }

  const meta = chimpMeta({
    cart: cartKey(lines).slice(0, 490),
    name,
    ...(userId ? { shop_user_id: userId } : {}),
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    client_reference_id: userId ?? undefined,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "NZ"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: shipping === 0 ? "Free shipping ($100+)" : "Ground shipping",
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(shipping * 100), currency: "usd" },
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
    allow_promotion_codes: true,
    submit_type: "pay",
    success_url: `${origin}/up/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/up/checkout`,
    metadata: meta,
    payment_intent_data: {
      description: "Urban Piranha",
      metadata: meta,
    },
    line_items: lines.map((line) => ({
      quantity: line.qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(line.price * 100),
        product_data: {
          name: `${line.name} · ${line.size}`,
          metadata: { slug: line.slug, size: line.size },
        },
      },
    })),
  });

  return { ok: true as const, preview: false as const, url: session.url, orderId: null };
}

export async function retrieveAndFulfill(sessionId: string) {
  if (!sessionId) return null;
  const stripe = stripeClient();
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return null;
  }
  return fulfillFromSession(session);
}

export async function fulfillFromSession(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email || "";
  const name = session.customer_details?.name || session.metadata?.name || "UP rider";
  const cart = parseCart(session.metadata?.cart ?? "");
  const lines = expandLines(cart);
  const { shipping, total } = totalsFor(lines);
  const amountCents = session.amount_total ?? Math.round(total * 100);
  const userId = session.metadata?.shop_user_id ?? session.client_reference_id ?? null;
  const shippingJson = session.customer_details
    ? JSON.stringify(session.customer_details)
    : null;

  return upsertPaidOrder({
    userId,
    email,
    name,
    stripeSessionId: session.id,
    status: "paid",
    amountCents,
    shippingCents: session.shipping_cost?.amount_total ?? Math.round(shipping * 100),
    lines: lines.length
      ? lines
      : [
          {
            slug: "urban-piranha-deck",
            size: "OS",
            qty: 1,
            name: "Urban Piranha order",
            price: amountCents / 100,
          },
        ],
    shippingJson,
  });
}

function parseCart(raw: string) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => {
      const [slug, size, qty] = part.split(":");
      if (!slug || !size || !qty) return null;
      return { slug, size: size as Size, qty: Number(qty) };
    })
    .filter((x): x is { slug: string; size: Size; qty: number } => Boolean(x));
}
