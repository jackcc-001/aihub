// app/tools/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import Header from '@/components/layout/Header'
import AdSlot from '@/components/ui/AdSlot'
import ReviewForm from './ReviewForm'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tool = await db.tool.findUnique({ where: { slug } })
  if (!tool) return {}
  return {
    title: `${tool.name} — 评测、价格、使用教程`,
    description: tool.description,
    openGraph: { title: tool.name, description: tool.description, type: 'website' },
  }
}

const PRICING_LABEL: Record<string, string> = {
  FREE: '完全免费', FREEMIUM: '免费+付费', PAID: '付费订阅',
}
const PRICING_CLASS: Record<string, string> = {
  FREE: styles.tagFree, FREEMIUM: styles.tagFreemium, PAID: styles.tagPaid,
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params

  const tool = await db.tool.findUnique({
    where: { slug, approved: true },
    include: { category: true, reviews: { orderBy: { createdAt: 'desc' }, take: 20 } },
  })
  if (!tool) notFound()

  const [, relatedTools] = await Promise.all([
    db.tool.update({ where: { id: tool.id }, data: { viewCount: { increment: 1 } } }).catch(() => {}),
    db.tool.findMany({
      where: { categoryId: tool.categoryId, approved: true, id: { not: tool.id } },
      orderBy: { rating: 'desc' },
      take: 5,
      include: { category: true },
    }),
  ])

  const avgRating = tool.rating.toFixed(1)

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadLink}>首页</Link>
          <span className={styles.breadSep}>›</span>
          <Link href={`/?category=${tool.category.slug}`} className={styles.breadLink}>{tool.category.name}</Link>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{tool.name}</span>
        </div>

        <div className={styles.layout}>
          <main className={styles.main}>
            <div className={styles.card}>
              <div className={styles.toolHeader}>
                <div className={styles.icon}>{tool.icon ?? '🔧'}</div>
                <div className={styles.toolMeta}>
                  <h1 className={styles.name}>{tool.name}</h1>
                  <div className={styles.metaRow}>
                    <span className={`${styles.pricingTag} ${PRICING_CLASS[tool.pricing]}`}>{PRICING_LABEL[tool.pricing]}</span>
                    <span className={styles.ratingInline}><span className={styles.star}>★</span> {avgRating}<span className={styles.ratingCount}>（{tool.ratingCount} 评价）</span></span>
                    <span className={styles.viewCount}>👁 {tool.viewCount.toLocaleString()} 次浏览</span>
                  </div>
                </div>
              </div>
              <p className={styles.desc}>{tool.description}</p>
              {tool.tags.length > 0 && (
                <div className={styles.tags}>
                  {tool.tags.map(tag => <Link key={tag} href={`/?q=${tag}`} className={styles.tag}>{tag}</Link>)}
                </div>
              )}
              <div className={styles.ctaRow}>
                <a href={tool.website} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>访问官网 →</a>
                <Link href={`/compare?a=${tool.slug}`} className={styles.compareBtn}>⚖️ 对比其他工具</Link>
              </div>
            </div>

            <AdSlot id="tool-detail-top" size="banner" label="广告" />

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>使用建议</h2>
              <div className={styles.tipList}>
                <div className={styles.tip}><span className={styles.tipIcon}>💡</span><div><p className={styles.tipTitle}>新手入门</p><p className={styles.tipDesc}>从免费套餐开始体验核心功能，了解基本操作后再考虑付费升级。</p></div></div>
                <div className={styles.tip}><span className={styles.tipIcon}>⚡</span><div><p className={styles.tipTitle}>提升效率</p><p className={styles.tipDesc}>结合具体场景设定任务，明确的输入能获得更精准的输出结果。</p></div></div>
                <div className={styles.tip}><span className={styles.tipIcon}>🔗</span><div><p className={styles.tipTitle}>组合使用</p><p className={styles.tipDesc}>与同类工具配合效果更佳，可在对比页查看各工具的特点差异。</p></div></div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>用户评价 ({tool.reviews.length})</h2>
              {tool.ratingCount > 0 && (
                <div className={styles.ratingBar}>
                  <div className={styles.ratingBig}>{avgRating}</div>
                  <div className={styles.ratingStars}>{'★'.repeat(Math.round(tool.rating))}{'☆'.repeat(5 - Math.round(tool.rating))}</div>
                  <div className={styles.ratingTotal}>{tool.ratingCount} 条评价</div>
                </div>
              )}
              {tool.reviews.length === 0 && <p className={styles.noReview}>还没有评价，来第一个评价吧</p>}
              {tool.reviews.map(r => (
                <div key={r.id} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.avatar}>{r.nickname[0]?.toUpperCase()}</div>
                    <div>
                      <span className={styles.reviewer}>{r.nickname}</span>
                      <div className={styles.reviewMeta}>
                        <span className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        <span className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>
                  </div>
                  {r.content && <p className={styles.reviewContent}>{r.content}</p>}
                </div>
              ))}
              <ReviewForm toolId={tool.id} />
            </div>

            <AdSlot id="tool-detail-bottom" size="banner" label="推广" />
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>基本信息</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}><span className={styles.infoLabel}>分类</span><span className={styles.infoValue}>{tool.category.icon} {tool.category.name}</span></div>
                <div className={styles.infoItem}><span className={styles.infoLabel}>定价</span><span className={styles.infoValue}>{PRICING_LABEL[tool.pricing]}</span></div>
                <div className={styles.infoItem}><span className={styles.infoLabel}>评分</span><span className={styles.infoValue}>⭐ {avgRating} / 5</span></div>
                <div className={styles.infoItem}><span className={styles.infoLabel}>浏览</span><span className={styles.infoValue}>{tool.viewCount.toLocaleString()}</span></div>
              </div>
              <a href={tool.website} target="_blank" rel="noopener noreferrer" className={styles.sideVisitBtn}>立即访问官网 →</a>
            </div>

            <AdSlot id="tool-sidebar" size="square" label="广告" />

            {relatedTools.length > 0 && (
              <div className={styles.sideCard}>
                <h3 className={styles.sideTitle}>同类工具推荐</h3>
                {relatedTools.map(t => (
                  <Link key={t.id} href={`/tools/${t.slug}`} className={styles.relatedItem}>
                    <span className={styles.relatedIcon}>{t.icon ?? '🔧'}</span>
                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedName}>{t.name}</span>
                      <span className={styles.relatedRating}>★ {t.rating.toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
                <Link href={`/?category=${tool.category.slug}`} className={styles.viewAllLink}>查看全部 {tool.category.name} →</Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
