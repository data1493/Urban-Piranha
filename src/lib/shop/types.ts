import type { Size } from "./catalog";

export type OrderLine = { slug: string; size: Size; qty: number; name: string; price: number };

export type ShopOrder = {
  id: string;
  email: string;
  name: string;
  status: string;
  amountCents: number;
  shippingCents: number;
  currency: string;
  lines: OrderLine[];
  createdAt: string;
  stripeSessionId: string | null;
};
