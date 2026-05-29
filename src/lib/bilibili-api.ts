/**
 * B站 API 客户端
 *
 * 使用 /x/series/recArchivesByKeywords 端点，无需 WBI 签名，无需 Cookie。
 * 参考：https://github.com/pskdje/bilibili-API-collect/blob/master/docs/video/collection.md
 */

export interface BilibiliVideo {
  aid: number;
  bvid: string;
  title: string;
  pubdate: number;
  description: string;
  mid: number;
  pic: string;
  duration: number;
}

interface RecArchivesResponse {
  code: number;
  message: string;
  data?: {
    archives?: BilibiliVideo[];
    page?: { total: number; pn: number; ps: number };
  };
}

/** 获取 UP 主最新视频（无需 Cookie | 无风控校验） */
export async function fetchUpVideos(
  uid: string,
  pageSize = 30,
): Promise<BilibiliVideo[]> {
  const params = new URLSearchParams({
    mid: uid,
    keywords: "",
    ps: String(pageSize),
    pn: "1",
    orderby: "pubdate",
  });

  const res = await fetch(
    `https://api.bilibili.com/x/series/recArchivesByKeywords?${params}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: `https://space.bilibili.com/${uid}`,
      },
    },
  );

  const json: RecArchivesResponse = await res.json();
  if (json.code !== 0) throw new Error(`B站 API 错误 (${json.code}): ${json.message}`);
  return json.data?.archives ?? [];
}

// ---------- 动态 ----------

export interface BilibiliDynamic {
  id_str: string;
  type: string;
  text: string;
  pub_ts: number;
  pictures: string[];
  userName?: string;
  avatar?: string;
}

interface DynamicResponse {
  code: number;
  message: string;
  data?: {
    has_more: boolean;
    items?: DynamicItem[];
  };
}

interface DynamicItem {
  id_str: string;
  type: string;
  modules: Record<string, unknown>[];
}

/** 获取 UP 主动态（desktop 端点，无需登录） */
export async function fetchUpDynamics(uid: string): Promise<BilibiliDynamic[]> {
  const params = new URLSearchParams({ host_mid: uid });
  const res = await fetch(
    `https://api.bilibili.com/x/polymer/web-dynamic/desktop/v1/feed/space?${params}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: `https://space.bilibili.com/${uid}/dynamic`,
      },
    },
  );

  const json: DynamicResponse = await res.json();
  if (json.code !== 0) throw new Error(`动态 API 错误 (${json.code}): ${json.message}`);

  return (json.data?.items ?? []).map((item) => {
    const modules = item.modules ?? [];

    // module_author 包含 pub_ts, user
    const authorModule = modules.find((m) => m.module_type === "MODULE_TYPE_AUTHOR");
    const author = (authorModule?.module_author ?? {}) as Record<string, unknown>;
    const pub_ts = (author.pub_ts as number) ?? 0;
    const userName = (author.user as { name?: string; face?: string })?.name ?? "";
    const avatar = (author.user as { face?: string })?.face ?? "";

    // module_desc 包含 text, rich_text_nodes
    const descModule = modules.find((m) => m.module_type === "MODULE_TYPE_DESC");
    const desc = (descModule?.module_desc ?? {}) as Record<string, unknown>;
    const text = (desc.text as string) ??
      ((desc.rich_text_nodes as { orig_text?: string; text?: string }[])
        ?.map((n) => n.orig_text ?? n.text ?? "")
        .join("") ?? "");

    // module_dynamic 包含 major (图片/视频等)
    const dynModule = modules.find((m) => m.module_type === "MODULE_TYPE_DYNAMIC");
    const dyn = (dynModule?.module_dynamic ?? {}) as Record<string, unknown>;
    const major = (dyn.major ?? {}) as Record<string, unknown>;
    const majorType = major.type as string | undefined;

    const pictures: string[] = [];
    if (majorType === "MAJOR_TYPE_DRAW") {
      const draw = (major.draw ?? {}) as { items?: { src?: string }[] };
      for (const img of draw.items ?? []) {
        if (img.src) pictures.push(img.src);
      }
    } else if (majorType === "MAJOR_TYPE_ARCHIVE") {
      const archive = (major.archive ?? {}) as { cover?: string; bvid?: string; title?: string };
      if (archive.cover) pictures.push(archive.cover);
    }

    return {
      id_str: item.id_str,
      type: item.type,
      text: text.slice(0, 500),
      pub_ts,
      pictures,
      userName,
      avatar,
    };
  });
}

export interface RecArchivesItem {
  aid: number;
  bvid: string;
  title: string;
  pubdate: number;
  description: string;
  mid: number;
  pic: string;
  duration: number;
}
