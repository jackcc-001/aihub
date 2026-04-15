// app/(admin)/admin/page.tsx
// 简单的管理后台，查看待审核工具提交
// 生产环境建议加上密码保护（见下面的 middleware.ts 注释）

import { db } from '@/lib/db'
import { approveSubmission } from './actions'
import styles from './page.module.css'

export default async function AdminPage() {
  const [submissions, pendingTools] = await Promise.all([
    db.submission.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    }),
    db.tool.findMany({
      where: { approved: false },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>管理后台</h1>

      <section>
        <h2 className={styles.section}>待审核提交 ({submissions.length})</h2>
        {submissions.length === 0 && <p className={styles.empty}>暂无待审核提交</p>}
        <div className={styles.list}>
          {submissions.map(s => (
            <div key={s.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <strong>{s.name}</strong>
                <a href={s.website} target="_blank" rel="noopener" className={styles.link}>{s.website}</a>
                <span className={styles.meta}>{s.category} · {new Date(s.createdAt).toLocaleDateString('zh-CN')}</span>
                <p>{s.description}</p>
                {s.email && <span className={styles.meta}>联系：{s.email}</span>}
              </div>
              <form action={approveSubmission}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className={styles.approveBtn}>通过并收录</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className={styles.section}>待上线工具 ({pendingTools.length})</h2>
        {pendingTools.length === 0 && <p className={styles.empty}>暂无待上线工具</p>}
      </section>
    </div>
  )
}
