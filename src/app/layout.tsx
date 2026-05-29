import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B站 VTuber 动态聚合",
  description: "订阅你喜欢的 B站虚拟主播，聚合展示最新视频投稿和动态",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
