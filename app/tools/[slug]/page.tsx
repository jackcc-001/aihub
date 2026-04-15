// app/tools/[slug]/page.tsx
// 工具详情页，相当于 Django 的 DetailView
// [slug] 是动态路由，对应 Django 的 <slug:slug>

import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Header from '@/components/layout/Header'
import ReviewForm from './ReviewForm'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

// 生成页面 meta（相当于 Django 模板的 {% block title %}）
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tool = await db.tool.findUnique({ where: { slug } })
  if (!tool) return {}
  return {
    title: tool.name,
    description: tool.description,
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params

  // 查询工具详情，同时增加浏览计数
  const tool = await db.tool.findUnique({
    where: { slug, approved: true },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!tool) notFound()

  // 异步更新浏览量（不阻塞渲染）
  db.tool.update({ where: { id: tool.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  const PRICING_LABEL: Record<string, string> = {
    FREE: '完全免费', FREEMIUM: '免费+付费', PAID: '付费订阅',
  }

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        {/* 工具头部 */}
        <div className={styles.card}>
          <div className={styles.toolHeader}>
            <div className={styles.icon}>{tool.icon ?? '🔧'}</div>
            <div>
              <h1 className={styles.name}>{tool.name}</h1>
              <p className={styles.category}>{tool.category.icon} {tool.category.name}</p>
            </div>
            <a href={tool.website} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
              访问官网 →
            </a>
          </div>

          <p className={styles.desc}>{tool.description}</p>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              定价：<strong>{PRICING_LABEL[tool.pricing]}</strong>
            </span>
            <span className={styles.metaItem}>
              评分：<strong>{tool.rating.toFixed(1)}</strong>（{tool.ratingCount} 人评价）
            </span>
            <span className={styles.metaItem}>
              浏览：<strong>{tool.viewCount.toLocaleString()}</strong> 次
            </span>
          </div>

          {/* 标签 */}
          {tool.tags.length > 0 && (
            <div className={styles.tags}>
              {tool.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* 详细介绍 */}
          {tool.detail && (
            <div className={styles.detail}>
              <h2>详细介绍</h2>
              <p>{tool.detail}</p>
            </div>
          )}
        </div>

        {/* 评论区 */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>用户评价 ({tool.reviews.length})</h2>

          {tool.reviews.map(r => (
            <div key={r.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewer}>{r.nickname}</span>
                <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className={styles.reviewDate}>
                  {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {r.content && <p className={styles.reviewContent}>{r.content}</p>}
            </div>
          ))}

          {/* 评论表单 — Client Component */}
          <ReviewForm toolId={tool.id} />
        </div>
      </div>
    </>
  )
}
