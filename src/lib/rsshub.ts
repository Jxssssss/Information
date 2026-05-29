import type { FeedSource } from "@/types/feed";
import type { FeedItem } from "@/types/feed";
import { fetchUpVideos, fetchUpDynamics, type BilibiliVideo, type BilibiliDynamic } from "@/lib/bilibili-api";

function itemId(sourceUid: string, bvid: string, title: string): string {
  return `${sourceUid}:${bvid || title}`.slice(0, 200);
}

function videoToItem(source: FeedSource, v: BilibiliVideo): FeedItem {
  return {
    id: itemId(source.uid, v.bvid, v.title),
    title: v.title?.trim() || "无标题",
    link: `https://www.bilibili.com/video/${v.bvid}`,
    pubDate: new Date(v.pubdate * 1000).toISOString(),
    cover: v.pic,
    summary: v.description?.slice(0, 280) || undefined,
    sourceUid: source.uid,
    sourceName: source.name,
  };
}

function dynamicToItem(source: FeedSource, d: BilibiliDynamic): FeedItem | null {
  const text = d.text?.trim();
  if (!text || text === "无文字") return null;

  return {
    id: `${source.uid}:dynamic:${d.id_str}`.slice(0, 200),
    title: text,
    link: `https://t.bilibili.com/${d.id_str}`,
    pubDate: new Date(d.pub_ts * 1000).toISOString(),
    cover: "",
    avatar: d.avatar,
    summary: undefined,
    sourceUid: source.uid,
    sourceName: source.name,
    isDynamic: true,
  };
}

/** 获取 UP 主视频投稿 */
export async function fetchVideoItems(source: FeedSource): Promise<FeedItem[]> {
  const videos = await fetchUpVideos(source.uid);
  return videos.map((v) => videoToItem(source, v));
}

/** 获取 UP 主动态 */
export async function fetchDynamicItems(source: FeedSource): Promise<FeedItem[]> {
  const dynamics = await fetchUpDynamics(source.uid);
  return dynamics.map((d) => dynamicToItem(source, d)).filter(Boolean) as FeedItem[];
}
