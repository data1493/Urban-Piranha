export type SearchTab = "all" | "images" | "videos" | "news";

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  domain: string;
  isLocal?: boolean;
}

export interface ImageHit {
  title: string;
  url: string;
  thumb: string;
  source: string;
  width?: number;
  height?: number;
}

export interface VideoHit {
  title: string;
  url: string;
  thumb: string;
  source: string;
  duration?: string;
}

export interface NewsHit {
  title: string;
  url: string;
  source: string;
  excerpt: string;
  published?: string;
}

export interface InstantAnswer {
  kind: "abstract" | "math" | "weather" | "country" | "time" | "convert";
  title: string;
  text: string;
  url?: string;
  image?: string;
  meta?: Record<string, string>;
}

export interface WikiSummary {
  title: string;
  extract: string;
  url: string;
  image?: string;
  description?: string;
}

export interface SearchPayload {
  query: string;
  tab: SearchTab;
  page: number;
  results: SearchResult[];
  images: ImageHit[];
  videos: VideoHit[];
  news: NewsHit[];
  instant: InstantAnswer | null;
  wiki: WikiSummary | null;
  related: string[];
}

export interface Settings {
  theme: "dark" | "light" | "system";
  safeSearch: boolean;
  newTab: boolean;
  saveHistory: boolean;
  region: string;
}

export interface HistoryItem {
  q: string;
  at: number;
}
