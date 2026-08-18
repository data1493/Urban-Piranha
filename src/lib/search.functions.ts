import { createServerFn } from "@tanstack/react-start";
import { autocomplete, runSearch } from "./search.server";
import type { SearchTab } from "./types";

function asTab(v: unknown): SearchTab {
  return v === "images" || v === "videos" || v === "news" ? v : "all";
}

export const performSearch = createServerFn({ method: "GET" })
  .validator((data: { q?: string; tab?: string; page?: number }) => ({
    q: String(data?.q ?? "").slice(0, 200),
    tab: asTab(data?.tab),
    page: Math.max(1, Number(data?.page) || 1),
  }))
  .handler(async ({ data }) => runSearch(data));

export const suggestQueries = createServerFn({ method: "GET" })
  .validator((data: { q?: string }) => ({ q: String(data?.q ?? "").slice(0, 80) }))
  .handler(async ({ data }) => {
    if (data.q.trim().length < 2) return [] as string[];
    return autocomplete(data.q.trim());
  });
