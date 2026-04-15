// app/submit/SubmitForm.tsx
'use client'

import { useState } from 'react'
import { submitTool } from './actions'
import styles from './SubmitForm.module.css'

const CATEGORIES = [
  '对话机器人', '图像生成', '写作助手', '编程开发',
  '视频创作', '音频语音', 'AI搜索', '办公效率', '其他',
]

export default function SubmitForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const result = await submitTool(new FormData(e.currentTarget))
    setStatus(result.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h2>提交成功！</h2>
        <p>我们会在 1-3 个工作日内审核，感谢你的贡献。</p>
        <button onClick={() => setStatus('idle')} className={styles.resetBtn}>继续提交</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>工具名称 *</label>
        <input name="name" required placeholder="如：ChatGPT" className={styles.input} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>官网链接 *</label>
        <input name="website" type="url" required placeholder="https://..." className={styles.input} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工具分类 *</label>
        <select name="category" required className={styles.select}>
          <option value="">请选择分类</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>简短描述 *</label>
        <textarea
          name="description" required rows={3}
          placeholder="用一两句话说明这个工具是做什么的，有什么特点"
          className={styles.textarea}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>你的邮箱（可选，审核结果通知）</label>
        <input name="email" type="email" placeholder="your@email.com" className={styles.input} />
      </div>

      <button type="submit" disabled={status === 'loading'} className={styles.btn}>
        {status === 'loading' ? '提交中...' : '提交工具'}
      </button>
      {status === 'error' && <p className={styles.error}>提交失败，请稍后重试</p>}
    </form>
  )
}
