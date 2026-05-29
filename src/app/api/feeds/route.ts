import { NextResponse } from "next/server";
import { getAggregatedFeeds, type FeedMode } from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get("refresh") === "1";
  const mode = (searchParams.get("mode") as FeedMode) || "video";
  const cacheTtlSec = Number(searchParams.get("cacheTtlSec"));
  const cacheTtlMs = Number.isFinite(cacheTtlSec) && cacheTtlSec > 0 ? cacheTtlSec * 1000 : undefined;

  try {
    const data = await getAggregatedFeeds(refresh, mode, cacheTtlMs);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
