import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/privacy")({
  component: Privacy,
  head: () => ({ meta: [{ title: "Privacy — Urban Piranha" }] }),
});

function Privacy() {
  return (
    <ShopPage kicker="Legal" title="Privacy">
      <p>
        We keep what we need to ship and talk: name, email, address, order
        lines. Stripe holds the card. We never see the full number.
      </p>
      <p>
        If you join the list, Chimp Sheets can send that email to Mailchimp and
        log the sale in Google Sheets — that’s the owner’s automation, not a
        third-party ad network we sold you to.
      </p>
      <p>
        Accounts use Google, X, or email. You can ask us to delete a profile
        from Contact.
      </p>
    </ShopPage>
  );
}
