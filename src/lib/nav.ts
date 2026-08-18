import type { SearchTab } from "@/lib/types";

export type NavLink = {
  label: string;
  to: "/" | "/search" | "/up" | "/maps";
  search?: { q?: string; tab?: SearchTab; p?: undefined };
};

export const TOP_LINKS: NavLink[] = [
  { label: "Web", to: "/" },
  { label: "Images", to: "/search", search: { q: "hip hop", tab: "images", p: undefined } },
  { label: "Videos", to: "/search", search: { q: "hip hop videos", tab: "videos", p: undefined } },
  { label: "News", to: "/search", search: { q: "hip hop news", tab: "news", p: undefined } },
  { label: "Maps", to: "/maps" },
  { label: "Shop", to: "/up" },
];

export const MORE_LINKS = [
  { label: "About", to: "/about" as const },
  { label: "Advertise", to: "/advertise" as const },
  { label: "DJ VEX", to: "/vex" as const },
  { label: "Privacy", to: "/privacy" as const },
  { label: "Settings", to: "/settings" as const },
];

/** @deprecated use TOP_LINKS */
export const CULTURE_LINKS = TOP_LINKS;

export const TRENDING = [
  "Kendrick Lamar",
  "Drake",
  "New Music Friday",
  "Rolling Loud",
  "Sneaker Drops",
  "Freestyle Friday",
];
