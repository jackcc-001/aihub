// app/page.tsx
export const dynamic = 'force-dynamic'
// 首页，Server Component（相当于 Django 的 ListView）
// searchParams 对应 Django 的 request.GET

import { db } from '@/lib/db'
import { Prisma, Pricing } from '@prisma/client'
import Header from '@/components/layout/Header'
import ToolCard from '@/components/ui/ToolCard'
import styles from './page.module.css'

interface Props {
  searchParams: Promise<{ category?: string; pricing?: string; q?: string; sort?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams

  // 并行拉取分类 + 工具（类似 Django 的 queryset）
  const [categories, tools, totalCount] = await Promise.all([
    db.category.findMany({ orderBy: { sort: 'asc' } }),
    db.tool.findMany({
      where: buildWhere(params),
      orderBy: buildOrderBy(params.sort),
      include: { category: true },
      take: 60,
    }),
    db.tool.count({ where: { approved: true } }),
  ])

  // 今日精选（固定取 featured=true 的第一个）
  const featured = tools.find(t => t.featured)

  return (
    <>
      <Header />

      {/* Hero区 */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>发现最好的 AI 工具</h1>
        <p className={styles.heroSub}>精选 {totalCount}+ 款AI工具，每日更新</p>

        {/* 搜索框 — 提交到当前页，用 GET 参数 */}
        <form action="/" method="GET" className={styles.searchForm}>
          <input
            name="q"
            defaultValue={params.q}
            placeholder="搜索工具名称、功能、使用场景..."
            className={styles.searchInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.searchBtn}>搜索</button>
        </form>

        <div className={styles.stats}>
          <div className={styles.stat}><b>{totalCount}+</b><span>收录工具</span></div>
          <div className={styles.stat}><b>{categories.length}</b><span>工具分类</span></div>
          <div className={styles.stat}><b>每日</b><span>更新频率</span></div>
        </div>
      </section>

      <div className={styles.layout}>
        {/* 侧边栏 — 分类筛选 */}
        <aside className={styles.sidebar}>
          <p className={styles.sideTitle}>分类</p>
          <a href="/" className={`${styles.catItem} ${!params.category ? styles.catActive : ''}`}>
            全部 <span className={styles.catCount}>{totalCount}</span>
          </a>
          {categories.map(cat => (
            <a
              key={cat.id}
              href={`/?category=${cat.slug}${params.q ? `&q=${params.q}` : ''}`}
              className={`${styles.catItem} ${params.category === cat.slug ? styles.catActive : ''}`}
            >
              {cat.icon} {cat.name}
            </a>
          ))}

          <p className={styles.sideTitle} style={{ marginTop: 24 }}>定价</p>
          {[
            { label: '免费', value: 'FREE' },
            { label: 'Freemium', value: 'FREEMIUM' },
            { label: '纯付费', value: 'PAID' },
          ].map(p => (
            <a
              key={p.value}
              href={`/?pricing=${p.value}${params.category ? `&category=${params.category}` : ''}`}
              className={`${styles.catItem} ${params.pricing === p.value ? styles.catActive : ''}`}
            >
              {p.label}
            </a>
          ))}
        </aside>

        {/* 主内容区 */}
        <main className={styles.main}>
          {/* 今日精选横幅 */}
          {featured && !params.q && (
            <a href={`/tools/${featured.slug}`} className={styles.featuredBanner}>
              <span className={styles.featuredLabel}>今日推荐</span>
              <span className={styles.featuredText}>
                <strong>{featured.name}</strong> — {featured.description}
              </span>
            </a>
          )}

          {/* 排序Tab */}
          <div className={styles.tabs}>
            {[
              { label: '最新收录', value: 'latest' },
              { label: '评分最高', value: 'rating' },
              { label: '浏览最多', value: 'views' },
            ].map(t => (
              <a
                key={t.value}
                href={`?sort=${t.value}${params.category ? `&category=${params.category}` : ''}`}
                className={`${styles.tab} ${(params.sort ?? 'latest') === t.value ? styles.tabActive : ''}`}
              >
                {t.label}
              </a>
            ))}
          </div>

          <div className={styles.contentHeader}>
            <span className={styles.resultCount}>
              {params.q ? `搜索 "${params.q}"` : params.category ? categories.find(c => c.slug === params.category)?.name ?? '全部' : '全部工具'}
              {' · '}{tools.length} 款
            </span>
          </div>

          {/* 工具网格 */}
          {tools.length > 0 ? (
            <div className={styles.grid}>
              {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              没有找到相关工具，<a href="/submit">点击提交</a>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

// ---- 查询构建辅助函数（相当于 Django 的 Q 对象）----

function buildWhere(params: { category?: string; pricing?: string; q?: string }) {
  const where: Prisma.ToolWhereInput = { approved: true }

  if (params.category) {
    where.category = { slug: params.category }
  }
  if (params.pricing) {
    where.pricing = params.pricing as Pricing
  }
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
      { tags: { has: params.q } },
    ]
  }
  return where
}

function buildOrderBy(sort?: string): Prisma.ToolOrderByWithRelationInput {
  if (sort === 'rating') return { rating: 'desc' }
  if (sort === 'views')  return { viewCount: 'desc' }
  return { createdAt: 'desc' }
}
