// components/ui/ToolCard.tsx
// 工具卡片，在首页网格中使用

import Link from 'next/link'
import { ToolWithCategory } from '@/lib/types'
import styles from './ToolCard.module.css'

const PRICING_LABEL: Record<string, string> = {
  FREE: '免费',
  FREEMIUM: 'Freemium',
  PAID: '付费',
}
const PRICING_CLASS: Record<string, string> = {
  FREE: styles.tagFree,
  FREEMIUM: styles.tagFreemium,
  PAID: styles.tagPaid,
}

interface Props {
  tool: ToolWithCategory
}

export default function ToolCard({ tool }: Props) {
  return (
    <Link href={`/tools/${tool.slug}`} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.icon}>{tool.icon ?? '🔧'}</div>
        <div className={styles.info}>
          <p className={styles.name}>{tool.name}</p>
          <p className={styles.desc}>{tool.description}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={`${styles.tag} ${PRICING_CLASS[tool.pricing]}`}>
          {PRICING_LABEL[tool.pricing]}
        </span>
        <span className={styles.rating}>
          <span className={styles.star}>★</span>
          {tool.rating.toFixed(1)}
        </span>
      </div>

      {tool.featured && <span className={styles.featuredBadge}>精选</span>}
    </Link>
  )
}
