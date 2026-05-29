import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Information — RSS 聚合阅读",
  description: "收集各方网站 RSS 订阅，按分类整理展示",
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
