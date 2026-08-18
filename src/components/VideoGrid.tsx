import type { VideoHit } from "@/lib/types";
import { SafeImg } from "./SafeImg";
import { Play } from "lucide-react";

export function VideoGrid({ videos }: { videos: VideoHit[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {videos.map((v) => (
        <a
          key={v.url}
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card group overflow-hidden p-0"
        >
          <div className="relative aspect-video bg-elevated">
            <SafeImg src={v.thumb} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-bg/70 text-fg">
              <Play className="size-5 fill-current" />
            </span>
            {v.duration && (
              <span className="absolute right-2 bottom-2 rounded bg-bg/80 px-1.5 py-0.5 text-[10px]">
                {v.duration}
              </span>
            )}
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-medium">{v.title}</p>
            <p className="mt-1 text-xs text-faint">{v.source}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
