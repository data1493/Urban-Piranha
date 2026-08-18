import type { InstantAnswer } from "./types";

const UA = "Metah4/1.0 (private meta-search; +https://metah4.com)";

async function json<T>(url: string, timeoutMs = 6000): Promise<T | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function safeEvalMath(expr: string): number | null {
  if (!/^[\d.\s+\-*/()^%]+$/.test(expr)) return null;
  const js = expr.replace(/\^/g, "**");
  try {
    const fn = new Function(`"use strict"; return (${js});`);
    const n = fn();
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const UNITS: Record<string, { to: string; factor: number; family: string }> = {
  km: { to: "mi", factor: 0.621371, family: "len" },
  mi: { to: "km", factor: 1.60934, family: "len" },
  m: { to: "ft", factor: 3.28084, family: "len" },
  ft: { to: "m", factor: 0.3048, family: "len" },
  kg: { to: "lb", factor: 2.20462, family: "mass" },
  lb: { to: "kg", factor: 0.453592, family: "mass" },
  c: { to: "f", factor: 1, family: "temp" },
  f: { to: "c", factor: 1, family: "temp" },
};

function convert(q: string): InstantAnswer | null {
  const m = q.match(/^([\d.]+)\s*(km|mi|m|ft|kg|lb|c|f|celsius|fahrenheit|miles?|kilometers?|meters?|feet|pounds?|kilos?)\s*(?:to|in)\s*(km|mi|m|ft|kg|lb|c|f|celsius|fahrenheit|miles?|kilometers?|meters?|feet|pounds?|kilos?)$/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const norm = (u: string) => {
    const x = u.toLowerCase();
    if (x.startsWith("cel") || x === "c") return "c";
    if (x.startsWith("fah") || x === "f") return "f";
    if (x.startsWith("mile")) return "mi";
    if (x.startsWith("kilo") && !x.startsWith("kilog")) return "km";
    if (x.startsWith("kilog") || x === "kilos") return "kg";
    if (x.startsWith("meter")) return "m";
    if (x.startsWith("feet") || x === "ft") return "ft";
    if (x.startsWith("pound")) return "lb";
    return x;
  };
  const from = norm(m[2]);
  const to = norm(m[3]);
  const a = UNITS[from];
  const b = UNITS[to];
  if (!a || !b || a.family !== b.family) return null;
  let out: number;
  if (a.family === "temp") {
    const c = from === "c" ? n : ((n - 32) * 5) / 9;
    out = to === "c" ? c : (c * 9) / 5 + 32;
  } else {
    const metersOrKg = n * (from === a.to ? 1 / a.factor : a.factor === 1 ? 1 : from === "km" || from === "m" || from === "kg" ? 1 : 1);
    // convert via the pair factor when from→default
    if (from === to) out = n;
    else if (a.to === to) out = n * a.factor;
    else if (b.to === from) out = n * b.factor;
    else out = n;
    void metersOrKg;
  }
  const pretty = Number.isInteger(out) ? String(out) : out.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return {
    kind: "convert",
    title: `${m[1]} ${from} = ${pretty} ${to}`,
    text: "Converted on-device. Nothing left this browser for the conversion.",
  };
}

async function weather(q: string): Promise<InstantAnswer | null> {
  const m = q.match(/^(?:weather|forecast|temperature)\s+(?:in\s+)?(.+)$/i) || q.match(/^(.+?)\s+weather$/i);
  if (!m) return null;
  const place = m[1].trim();
  const geo = await json<{
    results?: Array<{ name: string; latitude: number; longitude: number; country?: string; admin1?: string }>;
  }>(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`);
  const loc = geo?.results?.[0];
  if (!loc) return null;
  const w = await json<{
    current?: { temperature_2m?: number; weather_code?: number; wind_speed_10m?: number };
  }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code,wind_speed_10m`,
  );
  const t = w?.current?.temperature_2m;
  if (t == null) return null;
  const label = [loc.name, loc.admin1, loc.country].filter(Boolean).join(", ");
  return {
    kind: "weather",
    title: `${Math.round(t)}°C in ${label}`,
    text: `Wind ${Math.round(w?.current?.wind_speed_10m ?? 0)} km/h · Open-Meteo, no account required.`,
    meta: { place: label },
  };
}

async function country(q: string): Promise<InstantAnswer | null> {
  const m = q.match(/^(?:capital|population|currency|flag)\s+of\s+(.+)$/i) || q.match(/^(.+?)\s+(?:capital|population|currency)$/i);
  const name = m?.[1]?.trim() ?? (/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?$/.test(q) ? q : "");
  if (!name || name.split(" ").length > 3) return null;
  const rows = await json<
    Array<{
      name?: { common?: string };
      capital?: string[];
      population?: number;
      flags?: { svg?: string; png?: string };
      currencies?: Record<string, { name?: string; symbol?: string }>;
      region?: string;
    }>
  >(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,capital,population,flags,currencies,region`);
  const c = rows?.[0];
  if (!c?.name?.common) return null;
  const cur = c.currencies ? Object.values(c.currencies)[0] : undefined;
  return {
    kind: "country",
    title: c.name.common,
    text: `Capital ${c.capital?.[0] || "—"}. Population ${c.population?.toLocaleString() || "—"}. ${cur ? `Currency ${cur.name} (${cur.symbol || ""}).` : ""} ${c.region || ""}`.trim(),
    image: c.flags?.svg || c.flags?.png,
  };
}

function clock(q: string): InstantAnswer | null {
  if (!/^(time|what time|clock|utc|timezone)/i.test(q) && !/time in /i.test(q)) return null;
  const now = new Date();
  return {
    kind: "time",
    title: now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    text: now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " · resolved on your device.",
  };
}

export async function buildInstant(q: string): Promise<InstantAnswer | null> {
  const raw = q.trim();
  if (!raw) return null;

  const math = raw.match(/^[\d.\s+\-*/()^%]+$/);
  if (math) {
    const n = safeEvalMath(raw);
    if (n != null) {
      return { kind: "math", title: String(n), text: `${raw} = ${n}` };
    }
  }

  const conv = convert(raw.toLowerCase());
  if (conv) return conv;

  const tm = clock(raw);
  if (tm) return tm;

  const w = await weather(raw);
  if (w) return w;

  const c = await country(raw);
  if (c) return c;

  return null;
}
