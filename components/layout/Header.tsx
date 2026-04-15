// components/layout/Header.tsx
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
          <Link href="/ranking" className={styles.navLink}>排行榜</Link>
          <Link href="/compare" className={styles.navLink}>工具对比</Link>
          <Link href="/submit" className={styles.navLink}>提交工具</Link>
        </nav>
      </div>
    </header>
  )
}
