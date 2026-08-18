import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Slide = {
  id: string;
  image: string;
  kicker: string;
  title: string;
  body: string;
  object?: string;
  theme?: "default" | "up";
};

const SLIDES: Slide[] = [
  {
    id: "culture",
    image: "/brand/metah4-lobby.jpg",
    kicker: "Built for culture",
    title: "The search engine for hip hop culture",
    body: "Music. Videos. Artists. News. Fashion. Discovery.",
    object: "center",
  },
  {
    id: "logo",
    image: "/brand/metah4-wordmark.jpg",
    kicker: "Find what moves you",
    title: "MetaH4",
    body: "The mark. The screen. The culture.",
    object: "center",
  },
  {
    id: "moves",
    image: "/brand/metah4-store.jpg",
    kicker: "Driven by discovery",
    title: "Find what moves you",
    body: "A living screen for the culture — ads, drops, and the next thing.",
    object: "center 40%",
  },
  {
    id: "up",
    image: "/brand/up-magazine.jpg",
    kicker: "Sister brand",
    title: "Urban Piranha",
    body: "Ride urban. Live salty. Streetwear from the same world.",
    object: "center 18%",
    theme: "up",
  },
  {
    id: "merch",
    image: "/brand/metah4-merch.jpg",
    kicker: "Made for the people",
    title: "MetaH4 apparel",
    body: "Hoodies, fitteds, city colorways. Rep the search.",
    object: "center top",
  },
];

const INTERVAL_MS = 7000;

export function Billboard() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const slide = SLIDES[index];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, reduce, index]);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured screens"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="screen-glow relative overflow-hidden rounded-xl bg-elevated md:rounded-2xl">
        <div className="relative aspect-16/10 w-full sm:aspect-16/9">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={i !== index}
            >
              <img
                src={s.image}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: s.object ?? "center" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/55 to-bg/15" />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10">
            <p
              className={cn(
                "mb-2 text-[11px] font-semibold tracking-[0.22em] uppercase",
                slide.theme === "up" ? "text-up-bright" : "text-gold",
              )}
            >
              {slide.kicker}
            </p>
            <h1 className="font-display max-w-3xl text-4xl leading-none text-fg sm:text-6xl md:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">{slide.body}</p>
            {slide.id === "up" ? (
              <Link
                to="/up"
                className="mt-5 inline-flex h-11 w-fit items-center rounded-full bg-up px-5 text-sm font-semibold text-fg hover:bg-up-bright"
              >
                Enter UP
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Previous screen"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/60 text-fg backdrop-blur-sm hover:bg-elevated sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next screen"
            onClick={() => go(1)}
            className="absolute top-1/2 right-2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/60 text-fg backdrop-blur-sm hover:bg-elevated sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {!reduce && !paused ? (
          <div className="absolute top-0 right-0 left-0 h-0.5 overflow-hidden bg-line/60">
            <div key={slide.id} className="billboard-progress h-full bg-gold" />
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Show ${s.title}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-8 bg-gold" : "w-3 bg-line hover:bg-faint",
            )}
          />
        ))}
      </div>
    </section>
  );
}
