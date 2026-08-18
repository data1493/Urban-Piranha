import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About · MetaH4" }] }),
});

function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <p className="font-display text-5xl text-fg">
          Meta<span className="text-gold">H</span>
          <span className="text-purple">4</span>
        </p>
        <p className="mt-2 text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Find what moves you
        </p>

        <div className="mt-8 grid gap-4 text-sm leading-relaxed text-muted">
          <p>
            MetaH4 is the hip hop search engine. The homepage is a subway car. The screen in the
            middle of the doors is the living billboard — DJ VEX, culture ads, and Urban Piranha
            rotate through it.
          </p>
          <p>
            DJ VEX is the AI voice of MetaH4. Search with flavor. No account required. No
            advertising profile. Local results only when you ask.
          </p>
          <p>
            Sister brand:{" "}
            <Link to="/up" className="text-up-bright hover:underline">
              Urban Piranha
            </Link>{" "}
            — ride urban, live salty.
          </p>
          <p>
            Contact:{" "}
            <a href="mailto:metah4searchengine@proton.me" className="text-link hover:underline">
              metah4searchengine@proton.me
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
