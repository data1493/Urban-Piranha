import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/maps")({
  component: MapsPage,
  head: () => ({ meta: [{ title: "Maps · MetaH4" }] }),
});

const SPOTS = [
  { name: "Rolling Loud grounds", city: "Miami / NYC / LA", q: "Rolling Loud" },
  { name: "Amoeba Music", city: "Hollywood, CA", q: "Amoeba Music Hollywood" },
  { name: "The Apollo", city: "Harlem, NY", q: "Apollo Theater Harlem" },
  { name: "ComplexCon", city: "Las Vegas, NV", q: "ComplexCon" },
  { name: "Sneaker Con", city: "Touring", q: "Sneaker Con" },
  { name: "Urban Piranha drop", city: "On MetaH4", q: "Urban Piranha" },
];

function MapsPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <p className="inline-flex items-center gap-2 text-xs text-muted">
          <MapPin className="size-4 text-purple" />
          Local — New York, USA
        </p>
        <h1 className="font-display mt-2 text-5xl text-fg">Culture on the map</h1>
        <p className="mt-2 text-sm text-muted">
          Venues, drops, and rooms that move the culture. Search any pin.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SPOTS.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() =>
                  router.navigate({ to: "/search", search: { q: s.q, tab: "all", p: undefined } })
                }
                className="card w-full text-left"
              >
                <p className="text-sm font-semibold text-fg">{s.name}</p>
                <p className="mt-1 text-xs text-muted">{s.city}</p>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
