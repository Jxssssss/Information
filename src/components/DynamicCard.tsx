"use client";

import type { FeedItem } from "@/types/feed";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffHours < 48) return "昨天";
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

/** 社交动态卡片 — 头像 + 名字 + 时间 + 文字 */
export function DynamicCard({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent-dim)] hover:bg-[var(--surface-hover)]"
    >
      {/* 头部：头像 + 名字 + 时间 */}
      <div className="mb-3 flex items-center gap-3">
        {item.avatar ? (
          <img
            src={`/api/img?url=${encodeURIComponent(item.avatar)}`}
            alt=""
            className="h-9 w-9 rounded-full object-cover shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-[var(--bg)] shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text)] truncate">
            {item.sourceName}
          </p>
          <time dateTime={item.pubDate} className="text-xs text-[var(--muted)]">
            {formatDate(item.pubDate)}
          </time>
        </div>
      </div>

      {/* 正文 */}
      <p className="text-sm leading-relaxed text-[var(--text)] whitespace-pre-wrap break-words group-hover:text-[var(--text)]">
        {item.title}
      </p>
    </a>
  );
}
