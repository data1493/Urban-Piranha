import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sendContact } from "@/lib/shop/api";
import { ShopPage } from "@/components/shop/ShopPage";

export const Route = createFileRoute("/up/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — Urban Piranha" }] }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  return (
    <ShopPage kicker="Contact" title="Drop us a line">
      <p>Press, wholesale, a size that already swam away — write.</p>
      {sent ? (
        <p className="font-semibold text-up">Got it. We’ll bite back.</p>
      ) : (
        <form
          className="grid gap-3 text-up-ink"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const res = await sendContact({
              data: {
                name: String(fd.get("name") ?? ""),
                email: String(fd.get("email") ?? ""),
                message: String(fd.get("message") ?? ""),
              },
            });
            if (res.ok) setSent(true);
            else setErr(res.error);
          }}
        >
          <input
            name="name"
            required
            placeholder="Name"
            className="h-11 rounded-xl border border-up-line bg-white px-3 outline-none focus:border-up"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="h-11 rounded-xl border border-up-line bg-white px-3 outline-none focus:border-up"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Message"
            className="rounded-xl border border-up-line bg-white px-3 py-2 outline-none focus:border-up"
          />
          {err ? <p className="text-red-600">{err}</p> : null}
          <button
            type="submit"
            className="h-11 rounded-full bg-up text-sm font-semibold text-white"
          >
            Send
          </button>
        </form>
      )}
    </ShopPage>
  );
}
