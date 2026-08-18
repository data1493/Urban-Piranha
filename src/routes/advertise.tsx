import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/advertise")({
  component: AdvertisePage,
  head: () => ({
    meta: [
      { title: "Advertise on the MetaH4 Subway" },
      {
        name: "description",
        content: "Advertise your business on the MetaH4 subway. More clicks. More customers. More money.",
      },
    ],
  }),
});

function AdvertisePage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      url: String(data.get("url") ?? ""),
      pitch: String(data.get("pitch") ?? ""),
      at: Date.now(),
    };
    const prev = JSON.parse(localStorage.getItem("metah4:ads") || "[]") as unknown[];
    localStorage.setItem("metah4:ads", JSON.stringify([payload, ...prev].slice(0, 20)));
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
          The MetaH4 subway
        </p>
        <h1 className="font-display mt-2 text-5xl text-fg">Advertise your business</h1>
        <p className="mt-3 text-sm text-muted">
          Your next stop is the screen in the middle of the car. More clicks. More customers. More
          money.
        </p>

        {sent ? (
          <div className="card mt-8">
            <p className="text-lg font-semibold text-fg">Ad parked on the platform.</p>
            <p className="mt-2 text-sm text-muted">
              We saved your pitch on this device. When the network goes live, this is the queue.
            </p>
            <Link to="/" className="mt-4 inline-flex text-sm text-gold hover:underline">
              Back to the subway
            </Link>
          </div>
        ) : (
          <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-1 text-sm">
              <span className="text-muted">Business name</span>
              <input
                name="name"
                required
                className="h-11 rounded-xl border border-line bg-elevated px-3 text-fg outline-none focus:border-gold"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted">Website</span>
              <input
                name="url"
                type="url"
                required
                placeholder="https://"
                className="h-11 rounded-xl border border-line bg-elevated px-3 text-fg outline-none focus:border-gold"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-muted">What should ride the screen?</span>
              <textarea
                name="pitch"
                required
                rows={4}
                className="rounded-xl border border-line bg-elevated px-3 py-2 text-fg outline-none focus:border-gold"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-full bg-purple text-sm font-semibold text-fg hover:bg-purple-deep"
            >
              Upload your ad
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
