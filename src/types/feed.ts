export interface FeedSource {
  /** B站 UID，在 UP 主个人主页 URL 中可找到 */
  uid: string;
  /** UP 主名称 */
  name: string;
  /** 备注 / 标签 */
  note?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  /** 封面图 URL（视频）或动态图片 */
  cover: string;
  /** UP 主头像（动态模式） */
  avatar?: string;
  summary?: string;
  sourceUid: string;
  sourceName: string;
  /** 是否为动态 */
  isDynamic?: boolean;
}

export interface AggregatedFeeds {
  items: FeedItem[];
  fetchedAt: string;
  errors: { sourceUid: string; message: string }[];
}
