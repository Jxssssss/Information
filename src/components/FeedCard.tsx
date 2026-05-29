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
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-colors hover:border-[var(--accent-dim)] hover:bg-[var(--surface-hover)]"
    >
      {/* 封面 */}
      <div className="aspect-video bg-[var(--bg)] overflow-hidden">
        <img
          src={`/api/img?url=${encodeURIComponent(item.cover)}`}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* 信息区 */}
      <div className="p-3">
        <h3 className="mb-1.5 text-sm font-medium leading-snug line-clamp-2 group-hover:text-[var(--accent)]">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="truncate max-w-[120px] rounded bg-[var(--bg)] px-1.5 py-0.5 text-[var(--accent)]">
            {item.sourceName}
          </span>
          <time dateTime={item.pubDate}>{formatDate(item.pubDate)}</time>
        </div>
      </div>
    </a>
  );
}
