import type { ImageHit } from "@/lib/types";
import { SafeImg } from "./SafeImg";

export function ImageGrid({ images }: { images: ImageHit[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {images.map((img) => (
        <a
          key={img.url}
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-xl border border-line bg-surface"
        >
          <SafeImg
            src={img.thumb}
            alt={img.title}
            className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.03]"
          />
          <p className="truncate px-2 py-1.5 text-[11px] text-muted">{img.title}</p>
        </a>
      ))}
    </div>
  );
}
