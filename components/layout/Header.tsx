// components/layout/Header.tsx
// 顶部导航栏

import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.dot} />
          AIHub
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>发现</Link>
          <Link href="/submit" className={styles.navLink}>提交工具</Link>
        </nav>
      </div>
    </header>
  )
}
