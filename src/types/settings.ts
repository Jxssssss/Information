export interface AppSettings {
  /** 自动拉取间隔（分钟），0 = 仅手动刷新 */
  refreshIntervalMinutes: number;
}

export const REFRESH_INTERVAL_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "关闭（仅手动刷新）" },
  { value: 3, label: "每 3 分钟" },
  { value: 5, label: "每 5 分钟（默认）" },
  { value: 10, label: "每 10 分钟" },
  { value: 15, label: "每 15 分钟" },
  { value: 30, label: "每 30 分钟" },
  { value: 60, label: "每 1 小时" },
];

export const DEFAULT_SETTINGS: AppSettings = {
  refreshIntervalMinutes: 5,
};
