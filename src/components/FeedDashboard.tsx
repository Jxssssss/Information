"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FEED_SOURCES } from "@/config/feeds";
import { loadSettings } from "@/lib/settings-storage";
import { type AppSettings } from "@/types/settings";
import type { AggregatedFeeds, FeedItem } from "@/types/feed";
import { FeedCard } from "./FeedCard";
import { DynamicCard } from "./DynamicCard";
import { SettingsPanel } from "./SettingsPanel";

const DEFAULT_INTERVAL_MINUTES = 5;

function cacheTtlSec(appSettings: AppSettings): number {
  const minutes = appSettings.refreshIntervalMinutes;
  return (minutes > 0 ? minutes : DEFAULT_INTERVAL_MINUTES) * 60;
}

export function FeedDashboard() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [data, setData] = useState<AggregatedFeeds | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUid, setActiveUid] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [feedMode, setFeedMode] = useState<"video" | "dynamic">("video");
  const feedModeRef = useRef(feedMode);
  feedModeRef.current = feedMode;

  const load = useCallback(
    async (refresh = false, appSettings?: AppSettings, mode?: "video" | "dynamic") => {
      const s = appSettings ?? settingsRef.current;
      const m = mode ?? feedModeRef.current;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (refresh) params.set("refresh", "1");
        params.set("cacheTtlSec", String(cacheTtlSec(s)));
        params.set("mode", m);
        const res = await fetch(`/api/feeds?${params}`);
        if (!res.ok) throw new Error("加载失败");
        const json: AggregatedFeeds = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const initial = loadSettings();
    setSettings(initial);
    void load(false, initial);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const minutes = settings.refreshIntervalMinutes;
    if (minutes <= 0) return;

    const timer = setInterval(
      () => void load(true),
      minutes * 60 * 1000,
    );
    return () => clearInterval(timer);
  }, [settings.refreshIntervalMinutes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSettingsSaved = (next: AppSettings) => {
    setSettings(next);
    load(true, next);
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    let items: FeedItem[] = data.items;

    if (activeUid !== "all") {
      items = items.filter((i) => i.sourceUid === activeUid);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary?.toLowerCase().includes(q) ||
          i.sourceName.toLowerCase().includes(q),
      );
    }
    return items;
  }, [data, activeUid, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            B站 UP 主动态
          </h1>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm hover:border-[var(--accent-dim)]"
          >
            设置
          </button>
        </div>
        <p className="text-[var(--muted)]">
          订阅 {FEED_SOURCES.length} 位 UP 主
        </p>
        {data && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            上次更新：{new Date(data.fetchedAt).toLocaleString("zh-CN")}
            {settings.refreshIntervalMinutes > 0 ? (
              <span className="ml-2">
                · 每 {settings.refreshIntervalMinutes} 分钟自动拉取
              </span>
            ) : (
              <span className="ml-2">· 自动拉取已关闭</span>
            )}
            {data.errors.length > 0 && (
              <span className="ml-2 text-amber-400">
                · {data.errors.length} 个 UP 主拉取失败
              </span>
            )}
          </p>
        )}
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="搜索标题或 UP 主…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              const next = feedMode === "video" ? "dynamic" : "video";
              setFeedMode(next);
              load(true, undefined, next);
            }}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm hover:border-[var(--accent-dim)] disabled:opacity-50"
          >
            {feedMode === "video" ? "📹 投稿" : "📢 动态"}
          </button>
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading}
            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "刷新中…" : "刷新"}
          </button>
        </div>
      </div>

      {/* UP 主分类导航 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveUid("all")}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            activeUid === "all"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          }`}
        >
          全部
        </button>
        {FEED_SOURCES.map((s) => (
          <button
            key={s.uid}
            type="button"
            onClick={() => setActiveUid(s.uid)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              activeUid === s.uid
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
            }`}
            title={s.note}
          >
            {s.name}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {data?.errors && data.errors.length > 0 && (
        <details className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
          <summary className="cursor-pointer font-medium">
            部分 UP 主未能拉取（{data.errors.length}）
          </summary>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs opacity-90">
            {data.errors.map((e) => (
              <li key={e.sourceUid}>
                {FEED_SOURCES.find((s) => s.uid === e.sourceUid)?.name ??
                  e.sourceUid}
                ：{e.message}
              </li>
            ))}
          </ul>
        </details>
      )}

      {loading && !data ? (
        <div className={feedMode === "video"
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          : "space-y-3"}>
          {Array.from({ length: feedMode === "video" ? 12 : 6 }).map((_, i) => (
            feedMode === "video" ? (
              <div key={i} className="animate-pulse rounded-xl bg-[var(--surface)]">
                <div className="aspect-video rounded-t-xl bg-[var(--bg)]" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[var(--bg)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--bg)] rounded w-1/2" />
                </div>
              </div>
            ) : (
              <div key={i} className="animate-pulse rounded-xl bg-[var(--surface)] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[var(--bg)]" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-[var(--bg)] rounded w-20" />
                    <div className="h-3 bg-[var(--bg)] rounded w-12" />
                  </div>
                </div>
                <div className="h-4 bg-[var(--bg)] rounded w-full" />
                <div className="h-4 bg-[var(--bg)] rounded w-3/4" />
              </div>
            )
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-[var(--muted)]">
          {activeUid === "all"
            ? "暂无内容"
            : `「${FEED_SOURCES.find((s) => s.uid === activeUid)?.name}」暂无${feedMode === "video" ? "投稿" : "动态"}`}
        </p>
      ) : feedMode === "video" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-3">
          {filtered.map((item) => (
            <DynamicCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <footer className="mt-16 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
        在{" "}
        <code className="rounded bg-[var(--surface)] px-1.5 py-0.5">
          src/config/feeds.ts
        </code>{" "}
        管理订阅的 UP 主
      </footer>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={handleSettingsSaved}
      />
    </div>
  );
}
