import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Size } from "./catalog";
import type { ShopOrder } from "./types";

export type { ShopOrder, OrderLine } from "./types";

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { listOrdersForUser } = await import("./orders.server");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const session = await getSessionUser();
    return listOrdersForUser(context.userId, session?.email ?? "");
  });

export const getOrderById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { findOrderById } = await import("./orders.server");
    return findOrderById(id);
  });

export const lookupOrder = createServerFn({ method: "POST" })
  .validator((input: { id: string; email: string }) => input)
  .handler(async ({ data }) => {
    const id = data.id.trim();
    const email = data.email.trim().toLowerCase();
    if (!id || !email) return null;
    const { findOrderByIdAndEmail } = await import("./orders.server");
    return findOrderByIdAndEmail(id, email);
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((email: string) => email.trim().toLowerCase())
  .handler(async ({ data: email }) => {
    const { addNewsletter } = await import("./orders.server");
    return addNewsletter(email);
  });

export const sendContact = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; message: string }) => input)
  .handler(async ({ data }) => {
    const { addContact } = await import("./orders.server");
    let userId: string | null = null;
    try {
      const { getSessionUser } = await import("@/lib/auth/verify.server");
      userId = (await getSessionUser())?.id ?? null;
    } catch {
      userId = null;
    }
    return addContact({ userId, ...data });
  });

export const stripeStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { stripeConfigured } = await import("./stripe.server");
  return { ready: stripeConfigured() };
});

export const createCheckout = createServerFn({ method: "POST" })
  .validator(
    (input: {
      origin: string;
      email: string;
      name: string;
      subscribe?: boolean;
      lines: { slug: string; size: Size; qty: number }[];
    }) => input,
  )
  .handler(async ({ data }) => {
    const { createCheckoutSession } = await import("./stripe.server");
    return createCheckoutSession(data);
  });

export const fulfillStripeSession = createServerFn({ method: "GET" })
  .validator((sessionId: string) => sessionId)
  .handler(async ({ data: sessionId }) => {
    const { retrieveAndFulfill } = await import("./stripe.server");
    return retrieveAndFulfill(sessionId);
  });
