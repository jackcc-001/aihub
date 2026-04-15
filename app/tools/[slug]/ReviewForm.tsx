// app/tools/[slug]/ReviewForm.tsx
// 'use client' 表示这是客户端组件（类似 Django 里用JS提交表单）
// 调用 Server Action 提交评论，无需单独写 API 路由

'use client'

import { useState } from 'react'
import { submitReview } from './actions'
import styles from './ReviewForm.module.css'

export default function ReviewForm({ toolId }: { toolId: number }) {
  const [rating, setRating] = useState(5)
  const [hover, setHover]   = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    fd.append('toolId', String(toolId))
    fd.append('rating', String(rating))
    const result = await submitReview(fd)
    setStatus(result.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return <p className={styles.success}>感谢评价！审核后将显示。</p>
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>写下你的评价</h3>

      {/* 星级选择 */}
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n} type="button"
            className={n <= (hover || rating) ? styles.starOn : styles.starOff}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
          >★</button>
        ))}
      </div>

      <input name="nickname" placeholder="你的昵称" required className={styles.input} />
      <textarea name="content" placeholder="分享你的使用体验（可选）" className={styles.textarea} rows={3} />

      <button type="submit" disabled={status === 'loading'} className={styles.btn}>
        {status === 'loading' ? '提交中...' : '提交评价'}
      </button>
      {status === 'error' && <p className={styles.error}>提交失败，请稍后重试</p>}
    </form>
  )
}
