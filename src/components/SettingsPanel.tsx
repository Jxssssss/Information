"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, REFRESH_INTERVAL_OPTIONS, type AppSettings } from "@/types/settings";
import { loadSettings, saveSettings } from "@/lib/settings-storage";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onSaved: (settings: AppSettings) => void;
}

export function SettingsPanel({ open, onClose, onSaved }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) { setSettings(loadSettings()); setSaved(false); }
  }, [open]);

  if (!open) return null;

  function handleSave() {
    saveSettings(settings);
    onSaved(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#3d3226]/50 p-4 sm:items-center"
      onClick={onClose} role="presentation">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="settings-title">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">设置</h2>
          <button type="button" onClick={onClose}
            className="rounded-lg px-2 py-1 text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]">关闭</button>
        </div>

        <section className="mb-8">
          <h3 className="mb-1 text-sm font-medium text-[var(--accent)]">拉取频率</h3>
          <p className="mb-3 text-xs text-[var(--muted)]">
            页面打开时按间隔自动拉取各 UP 主的最新视频。API 直接调用 B站官方接口，无需第三方中转。
          </p>
          <select value={settings.refreshIntervalMinutes}
            onChange={(e) => setSettings((s) => ({ ...s, refreshIntervalMinutes: Number(e.target.value) }))}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]">
            {REFRESH_INTERVAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </section>

        <button type="button" onClick={handleSave}
          className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-[var(--accent-text)] hover:opacity-90">
          {saved ? "已保存" : "保存设置"}
        </button>
      </div>
    </div>
  );
}
