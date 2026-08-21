import { getSql } from "@/lib/db";
import { getProduct, shippingFor, type Size } from "./catalog";
import type { OrderLine, ShopOrder } from "./types";

export type { OrderLine, ShopOrder };

function newOrderId() {
  return `UP-${Date.now().toString(36).toUpperCase()}`;
}

export function expandLines(raw: { slug: string; size: Size; qty: number }[]) {
  const lines: OrderLine[] = [];
  for (const item of raw) {
    const product = getProduct(item.slug);
    if (!product) continue;
    if (!product.sizes.includes(item.size)) continue;
    const qty = Math.min(Math.max(Math.floor(item.qty), 1), 12);
    lines.push({
      slug: product.slug,
      size: item.size,
      qty,
      name: product.name,
      price: product.price,
    });
  }
  return lines;
}

export function totalsFor(lines: OrderLine[]) {
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}

type OrderRow = {
  id: string;
  email: string;
  name: string;
  status: string;
  amount_cents: number;
  shipping_cents: number;
  currency: string;
  lines_json: string;
  created_at: string;
  stripe_session_id: string | null;
};

function mapOrder(row: OrderRow): ShopOrder {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    status: row.status,
    amountCents: Number(row.amount_cents),
    shippingCents: Number(row.shipping_cents),
    currency: row.currency,
    lines: JSON.parse(row.lines_json) as OrderLine[],
    createdAt: String(row.created_at),
    stripeSessionId: row.stripe_session_id,
  };
}

export async function upsertPaidOrder(input: {
  id?: string;
  userId?: string | null;
  email: string;
  name: string;
  stripeSessionId?: string | null;
  status?: string;
  amountCents: number;
  shippingCents: number;
  lines: OrderLine[];
  shippingJson?: string | null;
}) {
  const sql = await getSql();
  const id = input.id ?? newOrderId();
  const sessionId = input.stripeSessionId ?? null;

  if (sessionId) {
    const existing = await sql<OrderRow>`
      select id, email, name, status, amount_cents, shipping_cents, currency, lines_json, created_at, stripe_session_id
      from shop_orders where stripe_session_id = ${sessionId} limit 1
    `;
    if (existing[0]) return mapOrder(existing[0]);
  }

  await sql`
    insert into shop_orders (
      id, user_id, email, name, stripe_session_id, status, amount_cents, shipping_cents, currency, lines_json, shipping_json, source
    ) values (
      ${id},
      ${input.userId ?? null},
      ${input.email},
      ${input.name},
      ${sessionId},
      ${input.status ?? "paid"},
      ${input.amountCents},
      ${input.shippingCents},
      ${"usd"},
      ${JSON.stringify(input.lines)},
      ${input.shippingJson ?? null},
      ${"urban-piranha"}
    )
  `;

  return {
    id,
    email: input.email,
    name: input.name,
    status: input.status ?? "paid",
    amountCents: input.amountCents,
    shippingCents: input.shippingCents,
    currency: "usd",
    lines: input.lines,
    createdAt: new Date().toISOString(),
    stripeSessionId: sessionId,
  } satisfies ShopOrder;
}

export async function listOrdersForUser(userId: string, email: string) {
  const sql = await getSql();
  const rows = await sql<OrderRow>`
    select id, email, name, status, amount_cents, shipping_cents, currency, lines_json, created_at, stripe_session_id
    from shop_orders
    where user_id = ${userId}
       or (user_id is null and ${email} <> '' and email = ${email})
    order by created_at desc
    limit 40
  `;
  return rows.map(mapOrder);
}

export async function findOrderById(id: string) {
  const sql = await getSql();
  const rows = await sql<OrderRow>`
    select id, email, name, status, amount_cents, shipping_cents, currency, lines_json, created_at, stripe_session_id
    from shop_orders where id = ${id} limit 1
  `;
  return rows[0] ? mapOrder(rows[0]) : null;
}

export async function findOrderByIdAndEmail(id: string, email: string) {
  const sql = await getSql();
  const rows = await sql<OrderRow>`
    select id, email, name, status, amount_cents, shipping_cents, currency, lines_json, created_at, stripe_session_id
    from shop_orders
    where id = ${id} and lower(email) = ${email}
    limit 1
  `;
  return rows[0] ? mapOrder(rows[0]) : null;
}

export async function addNewsletter(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Enter a real email." };
  }
  const sql = await getSql();
  await sql`
    insert into newsletter (email, source) values (${email}, ${"site"})
    on conflict (email) do nothing
  `;
  return { ok: true as const };
}

export async function addContact(input: {
  userId: string | null;
  name: string;
  email: string;
  message: string;
}) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const message = input.message.trim();
  if (!name || !email || !message) return { ok: false as const, error: "Fill every field." };
  const sql = await getSql();
  await sql`
    insert into contact_messages (user_id, name, email, message)
    values (${input.userId}, ${name}, ${email}, ${message})
  `;
  return { ok: true as const };
}
