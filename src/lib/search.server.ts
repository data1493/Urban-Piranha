import type {
  ImageHit,
  InstantAnswer,
  NewsHit,
  SearchPayload,
  SearchResult,
  SearchTab,
  VideoHit,
  WikiSummary,
} from "./types";
import { domainFromUrl } from "./format";
import { buildInstant } from "./instant.server";

const UA =
  "Metah4/1.0 (private meta-search; +https://metah4.com; metah4searchengine@proton.me)";

async function fetchText(
  url: string,
  timeoutMs = 7000,
  headers: Record<string, string> = {},
): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,application/json", ...headers },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchJson<T>(url: string, timeoutMs = 7000): Promise<T | null> {
  const text = await fetchText(url, timeoutMs, { Accept: "application/json" });
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function decodeHtml(s: string) {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function unwrapDdgRedirect(href: string): string {
  try {
    const u = new URL(href, "https://duckduckgo.com");
    const uddg = u.searchParams.get("uddg");
    if (uddg) return decodeURIComponent(uddg);
    return u.href;
  } catch {
    return href;
  }
}

function parseDdgHtml(html: string): SearchResult[] {
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  const blockRe =
    /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|td|div)>|)/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html))) {
    const url = unwrapDdgRedirect(m[1]);
    if (!url.startsWith("http") || seen.has(url)) continue;
    if (/duckduckgo\.com|javascript:/i.test(url)) continue;
    seen.add(url);
    results.push({
      title: decodeHtml(m[2]) || domainFromUrl(url),
      description: decodeHtml(m[3] || ""),
      url,
      domain: domainFromUrl(url),
    });
  }

  if (results.length === 0) {
    const loose =
      /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
    while ((m = loose.exec(html))) {
      const url = unwrapDdgRedirect(m[1]);
      if (!url.startsWith("http") || seen.has(url)) continue;
      if (/duckduckgo\.com/i.test(url)) continue;
      seen.add(url);
      results.push({
        title: decodeHtml(m[2]) || domainFromUrl(url),
        description: "",
        url,
        domain: domainFromUrl(url),
      });
    }
  }

  return results.slice(0, 12);
}

interface DdgIa {
  AbstractText?: string;
  AbstractURL?: string;
  AbstractSource?: string;
  Heading?: string;
  Image?: string;
  RelatedTopics?: Array<{ Text?: string; FirstURL?: string; Topics?: unknown[] }>;
  Answer?: string;
  AnswerType?: string;
  Infobox?: { content?: Array<{ label?: string; value?: string }> };
}

function resultsFromIa(ia: DdgIa, q: string): SearchResult[] {
  const out: SearchResult[] = [];
  if (ia.AbstractURL && ia.Heading) {
    out.push({
      title: ia.Heading,
      description: ia.AbstractText || "",
      url: ia.AbstractURL,
      domain: domainFromUrl(ia.AbstractURL),
    });
  }
  for (const t of ia.RelatedTopics ?? []) {
    if (t.FirstURL && t.Text) {
      out.push({
        title: t.Text.split(" - ")[0] || t.Text.slice(0, 80),
        description: t.Text,
        url: t.FirstURL,
        domain: domainFromUrl(t.FirstURL),
      });
    }
  }
  if (out.length === 0 && q) {
    out.push({
      title: `Search Wikipedia for “${q}”`,
      description: "Open the encyclopedia entry for this query.",
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
      domain: "en.wikipedia.org",
    });
  }
  return out.slice(0, 10);
}

export async function searchWeb(q: string): Promise<{
  results: SearchResult[];
  related: string[];
  ia: DdgIa | null;
}> {
  const encoded = encodeURIComponent(q);
  const [html, ia] = await Promise.all([
    fetchText(`https://html.duckduckgo.com/html/?q=${encoded}`),
    fetchJson<DdgIa>(
      `https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=1`,
    ),
  ]);

  let results = html ? parseDdgHtml(html) : [];
  if (results.length === 0 && ia) results = resultsFromIa(ia, q);

  const related: string[] = [];
  for (const t of ia?.RelatedTopics ?? []) {
    if (t.Text) {
      const phrase = t.Text.split(" - ")[0]?.trim();
      if (phrase && phrase.length < 48) related.push(phrase);
    }
  }

  return { results, related: related.slice(0, 8), ia: ia ?? null };
}

export async function searchWiki(q: string): Promise<WikiSummary | null> {
  const open = await fetchJson<[string, string[], string[], string[]]>(
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=1&namespace=0&format=json`,
  );
  const title = open?.[1]?.[0];
  if (!title) return null;
  const sum = await fetchJson<{
    title: string;
    extract?: string;
    description?: string;
    content_urls?: { desktop?: { page?: string } };
    thumbnail?: { source?: string };
  }>(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  if (!sum?.title) return null;
  return {
    title: sum.title,
    extract: sum.extract || "",
    description: sum.description,
    url: sum.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    image: sum.thumbnail?.source,
  };
}

interface CommonsHit {
  title?: string;
  url?: string;
  thumbnail?: { source?: string; width?: number; height?: number };
  descriptionurl?: string;
}

export async function searchImages(q: string): Promise<ImageHit[]> {
  const data = await fetchJson<{
    query?: { pages?: Record<string, CommonsHit> };
  }>(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=24&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=480&format=json&origin=*`,
  );
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  const hits: ImageHit[] = [];
  for (const p of pages) {
    const info = (p as CommonsHit & { imageinfo?: Array<{ url?: string; thumburl?: string; width?: number; height?: number; mime?: string; descriptionurl?: string }> }).imageinfo?.[0];
    if (!info?.url || !info.mime?.startsWith("image/")) continue;
    hits.push({
      title: (p.title || q).replace(/^File:/, ""),
      url: info.url,
      thumb: info.thumburl || info.url,
      source: "Wikimedia Commons",
      width: info.width,
      height: info.height,
    });
  }
  return hits;
}

export async function searchVideos(q: string): Promise<VideoHit[]> {
  const ia = await fetchJson<{
    response?: {
      docs?: Array<{
        identifier?: string;
        title?: string;
        description?: string;
      }>;
    };
  }>(
    `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q + " AND mediatype:movies")}&fl[]=identifier,title,description&rows=12&page=1&output=json`,
  );
  const docs = ia?.response?.docs ?? [];
  const videos: VideoHit[] = docs
    .filter((d) => d.identifier)
    .map((d) => ({
      title: d.title || q,
      url: `https://archive.org/details/${d.identifier}`,
      thumb: `https://archive.org/services/img/${d.identifier}`,
      source: "Internet Archive",
    }));

  if (videos.length < 4) {
    const wiki = await searchWiki(q);
    if (wiki) {
      videos.push({
        title: `${wiki.title} — related video sources`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        thumb: wiki.image || "/images/logo2a.png",
        source: "Open web",
      });
    }
  }
  return videos.slice(0, 12);
}

export async function searchNews(q: string): Promise<NewsHit[]> {
  const hn = await fetchJson<{
    hits?: Array<{
      title?: string;
      url?: string;
      story_url?: string;
      created_at?: string;
      author?: string;
    }>;
  }>(
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=10`,
  );

  const news: NewsHit[] = (hn?.hits ?? [])
    .filter((h) => h.title && (h.url || h.story_url))
    .map((h) => ({
      title: h.title!,
      url: h.url || h.story_url!,
      source: h.author ? `HN · ${h.author}` : "Hacker News",
      excerpt: "",
      published: h.created_at,
    }));

  if (news.length < 4) {
    const reddit = await fetchJson<{
      data?: {
        children?: Array<{
          data?: { title?: string; url?: string; subreddit?: string; created_utc?: number; selftext?: string };
        }>;
      };
    }>(`https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=8&sort=new`);
    for (const c of reddit?.data?.children ?? []) {
      const d = c.data;
      if (!d?.title || !d.url) continue;
      news.push({
        title: d.title,
        url: d.url.startsWith("http") ? d.url : `https://www.reddit.com${d.url}`,
        source: d.subreddit ? `r/${d.subreddit}` : "Reddit",
        excerpt: (d.selftext || "").slice(0, 180),
        published: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : undefined,
      });
    }
  }

  return news.slice(0, 12);
}

export async function runSearch(input: {
  q: string;
  tab: SearchTab;
  page: number;
}): Promise<SearchPayload> {
  const query = input.q.trim().slice(0, 200);
  const empty: SearchPayload = {
    query,
    tab: input.tab,
    page: input.page,
    results: [],
    images: [],
    videos: [],
    news: [],
    instant: null,
    wiki: null,
    related: [],
  };
  if (!query) return empty;

  const tab = input.tab;

  let results: SearchResult[] = [];
  let related: string[] = [];
  let ia: DdgIa | null = null;
  let wiki: WikiSummary | null = null;
  let images: ImageHit[] = [];
  let videos: VideoHit[] = [];
  let news: NewsHit[] = [];
  let instant: InstantAnswer | null = null;

  if (tab === "all") {
    const [web, w, inst] = await Promise.all([
      searchWeb(query),
      searchWiki(query),
      buildInstant(query),
    ]);
    results = web.results;
    related = web.related;
    ia = web.ia;
    wiki = w;
    instant = inst;
  } else if (tab === "images") {
    images = await searchImages(query);
  } else if (tab === "videos") {
    videos = await searchVideos(query);
  } else {
    news = await searchNews(query);
  }

  const abstract = ia?.AbstractText;
  if (!instant && abstract) {
    const img = ia?.Image;
    instant = {
      kind: "abstract",
      title: ia?.Heading || query,
      text: abstract,
      url: ia?.AbstractURL,
      image: img
        ? img.startsWith("http")
          ? img
          : `https://duckduckgo.com${img}`
        : undefined,
    };
  }

  return {
    query,
    tab,
    page: input.page,
    results,
    images,
    videos,
    news,
    instant,
    wiki,
    related,
  };
}

export async function autocomplete(q: string): Promise<string[]> {
  const data = await fetchJson<Array<{ phrase?: string } | string>>(
    `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`,
    4000,
  );
  if (!data) return [];
  if (Array.isArray(data) && data.length === 2 && Array.isArray(data[1])) {
    return (data[1] as string[]).slice(0, 8);
  }
  return (data as Array<{ phrase?: string }>)
    .map((d) => d.phrase)
    .filter((p): p is string => Boolean(p))
    .slice(0, 8);
}
