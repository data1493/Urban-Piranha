import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AudioLines, Brain, ChevronLeft, ChevronRight, Crown, Search, Upload } from "lucide-react";
import { cn } from "@/lib/cn";

type Slide =
  | { id: "vex"; kind: "vex" }
  | {
      id: string;
      kind: "image";
      image: string;
      alt: string;
      href?: "/up" | "/advertise" | "/vex";
    };

const SLIDES: Slide[] = [
  { id: "vex", kind: "vex" },
  {
    id: "litterbug",
    kind: "image",
    image: "/brand/subway/slide-litterbug.png",
    alt: "The Subway Sun — nobody loves a litterbug. Advertise your business on MetaH4.",
    href: "/advertise",
  },
  {
    id: "up",
    kind: "image",
    image: "/brand/subway/poster-up.png",
    alt: "Urban Piranha — MetaH4 Marketplace. Built for the streets. Made to dominate.",
    href: "/up",
  },
  {
    id: "bbq",
    kind: "image",
    image: "/brand/subway/poster-bbq.png",
    alt: "Flores Family Barbeque — Real wood. Real smoke. Real good.",
    href: "/advertise",
  },
  {
    id: "salsa",
    kind: "image",
    image: "/brand/subway/poster-salsa.png",
    alt: "Flores Salsaria — Fire and soul. Born from tradition, made for tomorrow.",
    href: "/advertise",
  },
];

const INTERVAL_MS = 7000;

const VEX_FEATURES = [
  { icon: AudioLines, title: "Search with VEX", body: "Get answers with hip hop flavor." },
  { icon: Search, title: "Real-time results", body: "From across the culture & internet." },
  { icon: Brain, title: "AI curated", body: "Filtered by DJ VEX for quality & truth." },
  { icon: Crown, title: "Hip hop first", body: "Built for the culture. By the culture." },
];

export function SubwayStage() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

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

  const go = (dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="MetaH4 subway screen"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="subway-rail" aria-hidden />

      <div className="relative flex items-stretch">
        <Door side="left" onClick={() => go(-1)} />

        <div className="subway-screen relative min-w-0 flex-1 overflow-hidden">
          <div className="relative aspect-video w-full">
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  i === index ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={i !== index}
              >
                {slide.kind === "vex" ? <VexSlide /> : <ImageSlide slide={slide} />}
              </div>
            ))}
          </div>

          {!reduce && !paused ? (
            <div className="absolute top-0 right-0 left-0 h-0.5 overflow-hidden bg-line/60">
              <div key={SLIDES[index].id} className="billboard-progress h-full bg-purple" />
            </div>
          ) : null}
        </div>

        <Door side="right" onClick={() => go(1)} />
      </div>
    </section>
  );
}

function Door({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <aside
      className={cn(
        "relative hidden w-28 shrink-0 flex-col justify-between overflow-hidden sm:flex md:w-36",
        side === "left" ? "rounded-l-sm" : "rounded-r-sm",
      )}
    >
      <img
        src={side === "left" ? "/brand/subway/door-left.jpg" : "/brand/subway/door-right.jpg"}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex flex-1 flex-col items-center justify-between px-1 py-3">
        <p className="text-center text-[8px] tracking-wide text-faint uppercase">Do not hold doors</p>
        <button
          type="button"
          aria-label={side === "left" ? "Previous screen" : "Next screen"}
          onClick={onClick}
          className="inline-flex size-10 items-center justify-center rounded-md border border-line/80 bg-bg/50 text-fg backdrop-blur-sm hover:bg-elevated"
        >
          {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
        </button>
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-[8px] tracking-wide text-faint uppercase">Do not lean on door</p>
          <img
            src={side === "left" ? "/brand/subway/sticker-left.jpg" : "/brand/subway/sticker-right.jpg"}
            alt="M4 Crew"
            className="h-14 w-14 rounded-sm object-cover ring-1 ring-black/60 md:h-16 md:w-16"
          />
        </div>
      </div>
    </aside>
  );
}

function VexSlide() {
  return (
    <div className="absolute inset-0 bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,color-mix(in_oklab,var(--color-purple)_35%,transparent),transparent_55%)]" />
      <div className="relative flex h-full items-stretch gap-2 p-4 sm:p-6 md:p-8">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-muted uppercase">Introducing</p>
          <h2 className="font-display mt-1 text-5xl leading-none text-fg sm:text-6xl md:text-7xl">DJ VEX</h2>
          <p className="mt-1 text-sm font-semibold tracking-wide text-purple uppercase sm:text-base">
            The AI voice of MetaH4
          </p>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted sm:text-sm">
            Powered by advanced AI. Curated by hip hop culture. DJ VEX delivers real results with
            bars, beats & knowledge.
          </p>
          <Link
            to="/vex"
            className="mt-4 inline-flex h-10 w-fit items-center rounded-md border border-purple/70 px-4 text-xs font-semibold tracking-wide text-fg uppercase hover:bg-purple/20"
          >
            Meet DJ VEX →
          </Link>
        </div>

        <div className="relative hidden w-[38%] max-w-xs shrink-0 sm:block">
          <img
            src="/brand/subway/dj-vex.jpg"
            alt="DJ VEX"
            className="vex-cut absolute inset-0 h-full w-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-bg to-transparent" />
        </div>

        <ul className="hidden w-48 shrink-0 flex-col justify-center gap-3 lg:flex">
          {VEX_FEATURES.map((f) => (
            <li key={f.title} className="flex gap-2.5">
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-purple/40 text-purple">
                <f.icon className="size-3.5" />
              </span>
              <span>
                <span className="block text-[11px] font-semibold tracking-wide text-fg uppercase">
                  {f.title}
                </span>
                <span className="block text-[11px] leading-snug text-muted">{f.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ImageSlide({ slide }: { slide: Extract<Slide, { kind: "image" }> }) {
  const frame = (
    <img src={slide.image} alt={slide.alt} className="h-full w-full bg-bg object-contain" />
  );
  if (slide.href) {
    return (
      <Link to={slide.href} className="absolute inset-0 bg-bg" aria-label={slide.alt}>
        {frame}
      </Link>
    );
  }
  return <div className="absolute inset-0 bg-bg">{frame}</div>;
}

export function AdvertiseCard() {
  return (
    <div className="rounded-xl border border-line bg-surface/80 p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-purple/40 text-purple">
          <Upload className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-fg uppercase">
            Advertise your business
          </p>
          <p className="text-[11px] font-semibold tracking-wide text-purple uppercase">
            on the MetaH4 subway
          </p>
          <p className="mt-1 text-[11px] text-muted">More clicks. More customers. More money.</p>
          <Link
            to="/advertise"
            className="mt-3 inline-flex h-9 items-center rounded-full bg-purple px-4 text-[11px] font-semibold tracking-wide text-fg uppercase hover:bg-purple-deep"
          >
            Upload your ad now →
          </Link>
        </div>
      </div>
    </div>
  );
}
