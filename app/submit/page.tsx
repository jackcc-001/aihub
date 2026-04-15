// app/submit/page.tsx
// 工具提交页，相当于 Django 的 CreateView

import Header from '@/components/layout/Header'
import SubmitForm from './SubmitForm'
import styles from './page.module.css'

export const metadata = {
  title: '提交工具',
  description: '向AIHub提交你发现的好工具',
}

export default function SubmitPage() {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>提交 AI 工具</h1>
          <p className={styles.sub}>发现了好工具？分享给大家，审核通过后将出现在首页</p>
          <SubmitForm />
        </div>
      </div>
    </>
  )
}
