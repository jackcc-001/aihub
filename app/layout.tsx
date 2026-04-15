// app/layout.tsx
// 相当于 Django 的 base.html，所有页面共享的壳

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'AIHub - 发现最好的AI工具', template: '%s | AIHub' },
  description: '精选1200+款AI工具，每日更新，帮你找到最适合的那一个',
  keywords: ['AI工具', '人工智能', 'ChatGPT', 'Midjourney', 'AI导航'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
