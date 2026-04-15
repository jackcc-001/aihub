// app/compare/CompareSelector.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './CompareSelector.module.css'

interface Tool { slug: string; name: string; icon: string | null }

interface Props {
  tools: Tool[]
  slugA?: string
  slugB?: string
}

export default function CompareSelector({ tools, slugA, slugB }: Props) {
  const router = useRouter()
  const [a, setA] = useState(slugA ?? '')
  const [b, setB] = useState(slugB ?? '')

  function handleCompare() {
    if (a && b && a !== b) {
      router.push(`/compare?a=${a}&b=${b}`)
    }
  }

  return (
    <div className={styles.selector}>
      <select value={a} onChange={e => setA(e.target.value)} className={styles.select}>
        <option value="">选择工具 A</option>
        {tools.filter(t => t.slug !== b).map(t => (
          <option key={t.slug} value={t.slug}>{t.icon} {t.name}</option>
        ))}
      </select>

      <span className={styles.vs}>VS</span>

      <select value={b} onChange={e => setB(e.target.value)} className={styles.select}>
        <option value="">选择工具 B</option>
        {tools.filter(t => t.slug !== a).map(t => (
          <option key={t.slug} value={t.slug}>{t.icon} {t.name}</option>
        ))}
      </select>

      <button onClick={handleCompare} disabled={!a || !b || a === b} className={styles.btn}>
        开始对比 →
      </button>
    </div>
  )
}
