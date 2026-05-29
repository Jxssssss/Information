import { FEED_SOURCES } from "@/config/feeds";
import { fetchVideoItems, fetchDynamicItems } from "@/lib/rsshub";
import type { AggregatedFeeds, FeedItem } from "@/types/feed";

const cache = new Map<string, { data: AggregatedFeeds; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000;
const MIN_TTL = 60 * 1000;

export type FeedMode = "video" | "dynamic";

export async function getAggregatedFeeds(
  forceRefresh = false,
  mode: FeedMode = "video",
  cacheTtlMs = CACHE_TTL,
): Promise<AggregatedFeeds> {
  const ttl = Math.max(cacheTtlMs, MIN_TTL);
  const now = Date.now();
  const key = `bilibili:${mode}`;
  const cached = cache.get(key);

  if (!forceRefresh && cached && cached.expiresAt > now) {
    return cached.data;
  }

  const fetcher = mode === "dynamic" ? fetchDynamicItems : fetchVideoItems;
  const results = await Promise.allSettled(FEED_SOURCES.map((s) => fetcher(s)));

  const items: FeedItem[] = [];
  const errors: AggregatedFeeds["errors"] = [];

  results.forEach((result, index) => {
    const source = FEED_SOURCES[index];
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      const message = result.reason instanceof Error ? result.reason.message : "拉取失败";
      errors.push({ sourceUid: source.uid, message });
    }
  });

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const data: AggregatedFeeds = { items, fetchedAt: new Date().toISOString(), errors };
  cache.set(key, { data, expiresAt: now + ttl });
  return data;
}

export function getFeedSources() {
  return FEED_SOURCES;
}
