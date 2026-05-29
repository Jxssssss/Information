import { DEFAULT_SETTINGS, REFRESH_INTERVAL_OPTIONS, type AppSettings } from "@/types/settings";

const STORAGE_KEY = "information-settings";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      refreshIntervalMinutes: REFRESH_INTERVAL_OPTIONS.some((o) => o.value === parsed.refreshIntervalMinutes)
        ? parsed.refreshIntervalMinutes!
        : DEFAULT_SETTINGS.refreshIntervalMinutes,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
