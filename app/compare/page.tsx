// app/compare/page.tsx
// 工具对比页 — SEO 价值极高，"A vs B" 类搜索流量大
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import Header from '@/components/layout/Header'
import AdSlot from '@/components/ui/AdSlot'
import CompareSelector from './CompareSelector'
import styles from './page.module.css'

interface Props {
  searchParams: Promise<{ a?: string; b?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { a, b } = await searchParams
  if (a && b) {
    const [toolA, toolB] = await Promise.all([
      db.tool.findUnique({ where: { slug: a } }),
      db.tool.findUnique({ where: { slug: b } }),
    ])
    if (toolA && toolB) {
      return {
        title: `${toolA.name} vs ${toolB.name} — 对比评测`,
        description: `详细对比 ${toolA.name} 和 ${toolB.name} 的功能、定价、评分，帮你选出最适合的AI工具。`,
      }
    }
  }
  return { title: 'AI工具对比 — 选出最适合你的工具' }
}

const PRICING_LABEL: Record<string, string> = {
  FREE: '完全免费', FREEMIUM: '免费+付费', PAID: '付费订阅',
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams

  const allTools = await db.tool.findMany({
    where: { approved: true },
    orderBy: { rating: 'desc' },
    select: { slug: true, name: true, icon: true, categoryId: true },
  })

  let toolA = null, toolB = null
  if (a) toolA = await db.tool.findUnique({ where: { slug: a, approved: true }, include: { category: true, reviews: { take: 3, orderBy: { createdAt: 'desc' } } } })
  if (b) toolB = await db.tool.findUnique({ where: { slug: b, approved: true }, include: { category: true, reviews: { take: 3, orderBy: { createdAt: 'desc' } } } })

  const compareRows = [
    { label: '分类', a: toolA?.category.name, b: toolB?.category.name },
    { label: '定价模式', a: toolA ? PRICING_LABEL[toolA.pricing] : null, b: toolB ? PRICING_LABEL[toolB.pricing] : null },
    { label: '综合评分', a: toolA?.rating.toFixed(1), b: toolB?.rating.toFixed(1), compare: true },
    { label: '评价数量', a: toolA?.ratingCount.toString(), b: toolB?.ratingCount.toString() },
    { label: '浏览次数', a: toolA?.viewCount.toLocaleString(), b: toolB?.viewCount.toLocaleString() },
    { label: '官网', a: toolA?.website, b: toolB?.website, isLink: true },
  ]

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>AI工具对比</h1>
          <p className={styles.pageSub}>选择两款工具，一键对比功能、定价和用户评价</p>
        </div>

        {/* 选择工具 — Client Component */}
        <CompareSelector tools={allTools} slugA={a} slugB={b} />

        {toolA && toolB && (
          <>
            {/* 对比头部 */}
            <div className={styles.compareHeader}>
              <div className={styles.compareHero}>
                <div className={styles.heroIcon}>{toolA.icon ?? '🔧'}</div>
                <h2 className={styles.heroName}>{toolA.name}</h2>
                <p className={styles.heroDesc}>{toolA.description}</p>
                <a href={toolA.website} target="_blank" rel="noopener" className={styles.heroBtn}>访问官网 →</a>
              </div>
              <div className={styles.vsBadge}>VS</div>
              <div className={styles.compareHero}>
                <div className={styles.heroIcon}>{toolB.icon ?? '🔧'}</div>
                <h2 className={styles.heroName}>{toolB.name}</h2>
                <p className={styles.heroDesc}>{toolB.description}</p>
                <a href={toolB.website} target="_blank" rel="noopener" className={styles.heroBtn}>访问官网 →</a>
              </div>
            </div>

            <AdSlot id="compare-mid" size="banner" label="广告" />

            {/* 对比表格 */}
            <div className={styles.card}>
              <h3 className={styles.tableTitle}>详细对比</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>对比项目</th>
                    <th className={styles.th}>{toolA.name}</th>
                    <th className={styles.th}>{toolB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map(row => {
                    const aWins = row.compare && toolA && toolB && toolA.rating > toolB.rating
                    const bWins = row.compare && toolA && toolB && toolB.rating > toolA.rating
                    return (
                      <tr key={row.label} className={styles.tr}>
                        <td className={styles.tdLabel}>{row.label}</td>
                        <td className={`${styles.td} ${aWins ? styles.winner : ''}`}>
                          {row.isLink && row.a
                            ? <a href={row.a} target="_blank" rel="noopener" className={styles.linkCell}>访问</a>
                            : <span>{row.a ?? '—'}{aWins ? ' 🏆' : ''}</span>
                          }
                        </td>
                        <td className={`${styles.td} ${bWins ? styles.winner : ''}`}>
                          {row.isLink && row.b
                            ? <a href={row.b} target="_blank" rel="noopener" className={styles.linkCell}>访问</a>
                            : <span>{row.b ?? '—'}{bWins ? ' 🏆' : ''}</span>
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 标签对比 */}
            <div className={styles.tagCompare}>
              <div className={styles.tagCol}>
                <h4 className={styles.tagTitle}>{toolA.name} 特点标签</h4>
                <div className={styles.tagList}>
                  {toolA.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  {toolA.tags.length === 0 && <span className={styles.noTag}>暂无标签</span>}
                </div>
              </div>
              <div className={styles.tagCol}>
                <h4 className={styles.tagTitle}>{toolB.name} 特点标签</h4>
                <div className={styles.tagList}>
                  {toolB.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  {toolB.tags.length === 0 && <span className={styles.noTag}>暂无标签</span>}
                </div>
              </div>
            </div>
          </>
        )}

        {(!toolA || !toolB) && (
          <div className={styles.placeholder}>
            <p>请在上方选择两款工具开始对比</p>
            <p className={styles.placeholderSub}>支持对比任意两款已收录的AI工具</p>
          </div>
        )}
      </div>
    </>
  )
}
