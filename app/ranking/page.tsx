// app/ranking/page.tsx
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import Header from '@/components/layout/Header'
import AdSlot from '@/components/ui/AdSlot'
import styles from './page.module.css'

export const metadata = {
  title: 'AI工具排行榜 — 本周最热门',
  description: '每周更新的AI工具热度排行，基于用户浏览量和评分综合排名',
}

export default async function RankingPage() {
  const [byRating, byViews, newest] = await Promise.all([
    // 评分榜
    db.tool.findMany({
      where: { approved: true, ratingCount: { gt: 0 } },
      orderBy: { rating: 'desc' },
      take: 10,
      include: { category: true },
    }),
    // 热度榜
    db.tool.findMany({
      where: { approved: true },
      orderBy: { viewCount: 'desc' },
      take: 10,
      include: { category: true },
    }),
    // 最新收录
    db.tool.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { category: true },
    }),
  ])

  const PRICING_COLOR: Record<string, string> = {
    FREE: '#0F6E56', FREEMIUM: '#854F0B', PAID: '#993C1D',
  }
  const PRICING_BG: Record<string, string> = {
    FREE: '#E1F5EE', FREEMIUM: '#FAEEDA', PAID: '#FAECE7',
  }
  const PRICING_LABEL: Record<string, string> = {
    FREE: '免费', FREEMIUM: 'Freemium', PAID: '付费',
  }

  const RankList = ({ tools, showViews }: { tools: typeof byRating, showViews?: boolean }) => (
    <div className={styles.rankList}>
      {tools.map((tool, i) => (
        <Link key={tool.id} href={`/tools/${tool.slug}`} className={styles.rankItem}>
          <span className={`${styles.rank} ${i < 3 ? styles.rankTop : ''}`}>{i + 1}</span>
          <span className={styles.rankIcon}>{tool.icon ?? '🔧'}</span>
          <div className={styles.rankInfo}>
            <span className={styles.rankName}>{tool.name}</span>
            <span className={styles.rankCat}>{tool.category.name}</span>
          </div>
          <div className={styles.rankRight}>
            <span
              className={styles.rankPricing}
              style={{ background: PRICING_BG[tool.pricing], color: PRICING_COLOR[tool.pricing] }}
            >
              {PRICING_LABEL[tool.pricing]}
            </span>
            {showViews
              ? <span className={styles.rankStat}>👁 {tool.viewCount.toLocaleString()}</span>
              : <span className={styles.rankStat}>★ {tool.rating.toFixed(1)}</span>
            }
          </div>
        </Link>
      ))}
    </div>
  )

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>AI工具排行榜</h1>
          <p className={styles.pageSub}>基于用户评分与浏览量综合排名，每日更新</p>
        </div>

        <AdSlot id="ranking-top" size="banner" label="广告" />

        <div className={styles.grid}>
          <section className={styles.section}>
            <h2 className={styles.secTitle}>⭐ 评分最高</h2>
            <RankList tools={byRating} />
          </section>

          <section className={styles.section}>
            <h2 className={styles.secTitle}>🔥 浏览最多</h2>
            <RankList tools={byViews} showViews />
          </section>

          <section className={styles.section}>
            <h2 className={styles.secTitle}>🆕 最新收录</h2>
            <RankList tools={newest} />
          </section>
        </div>
      </div>
    </>
  )
}
