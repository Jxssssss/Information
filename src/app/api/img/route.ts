import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * B站 图片代理 — B站 封面图需要 Referer 头才能加载，此路由做反向代理。
 * 用法：/api/img?url=https://i0.hdslb.com/bfs/archive/xxx.jpg
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "missing url" }, { status: 400 });
  }

  // 安全检查：只允许 B站 图片域名
  const parsed = (() => { try { return new URL(url); } catch { return null; } })();
  if (!parsed || !parsed.hostname.endsWith(".hdslb.com")) {
    return NextResponse.json({ error: "invalid domain" }, { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://www.bilibili.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `upstream ${res.status}` },
        { status: 502 },
      );
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const cacheControl = "public, max-age=86400, immutable";

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
