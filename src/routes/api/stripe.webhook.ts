import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { fulfillFromSession } from "@/lib/shop/stripe.server";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.STRIPE_SECRET_KEY;
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!key || !secret) {
          return Response.json({ error: "Stripe webhook not configured" }, { status: 503 });
        }
        const stripe = new Stripe(key);
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");
        if (!sig) {
          return Response.json({ error: "Missing signature" }, { status: 400 });
        }
        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(body, sig, secret);
        } catch {
          return Response.json({ error: "Invalid signature" }, { status: 400 });
        }
        if (event.type === "checkout.session.completed") {
          const raw = event.data.object as Stripe.Checkout.Session;
          const session = await stripe.checkout.sessions.retrieve(raw.id, {
            expand: ["line_items"],
          });
          await fulfillFromSession(session);
        }
        return Response.json({ received: true });
      },
    },
  },
});
