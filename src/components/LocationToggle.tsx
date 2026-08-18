import { MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function LocationToggle() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [error, setError] = useState("");

  function toggle() {
    if (on) {
      setOn(false);
      setLabel(null);
      setError("");
      return;
    }
    if (!navigator.geolocation) {
      setError("Location not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=10`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = (await res.json()) as {
            address?: { city?: string; town?: string; county?: string; state_code?: string; state?: string };
          };
          const city = data.address?.city || data.address?.town || data.address?.county;
          const state = data.address?.state_code || data.address?.state;
          setLabel([city, state].filter(Boolean).join(", ") || "Local");
        } catch {
          setLabel("Local");
        }
        setOn(true);
        setError("");
      },
      () => setError("Permission denied"),
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          on ? "border-purple/50 bg-purple/15 text-purple" : "border-line bg-elevated text-muted hover:text-fg",
        )}
      >
        <MapPin className="size-3.5" />
        {on ? `Local · ${label ?? "on"}` : "Local results"}
      </button>
      {error && <span className="text-[11px] text-gold">{error}</span>}
    </div>
  );
}
