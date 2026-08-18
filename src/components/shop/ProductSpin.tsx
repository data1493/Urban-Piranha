import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  frames: string[];
  alt: string;
  dark?: boolean;
  face?: number;
};

export function ProductSpin({ frames, alt, dark, face = 0 }: Props) {
  const [angle, setAngle] = useState(0);
  const drag = useRef<{ x: number; angle: number } | null>(null);
  const n = Math.max(frames.length, 1);

  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  useEffect(() => {
    setAngle(face * (360 / n));
  }, [face, n]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, angle };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setAngle(drag.current.angle + (e.clientX - drag.current.x) * 0.7);
  };
  const onUp = () => {
    drag.current = null;
  };

  const rot = ((angle % 360) + 360) % 360;
  const idx = Math.round((rot / 360) * n) % n;
  const step = 360 / n;
  const local = rot - idx * step;
  const tilt = ((local + step / 2) % step) - step / 2;
  const scaleX = Math.max(0.12, Math.cos((tilt * Math.PI) / 180));
  const src = frames[idx] ?? frames[0];

  return (
    <div
      className={cn(
        "relative aspect-4/5 cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-up-line",
        dark ? "bg-black" : "bg-[#7a7470]",
      )}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label={`${alt}. Drag to spin.`}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-full object-contain"
        style={{ transform: `scaleX(${scaleX})`, transformOrigin: "center" }}
      />
      <p
        className={cn(
          "pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] font-semibold tracking-[0.18em] uppercase",
          dark ? "text-white/70" : "text-white/80",
        )}
      >
        Drag to spin
      </p>
    </div>
  );
}
