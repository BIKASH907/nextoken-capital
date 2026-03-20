import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from "react";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.brandWrap}>
          <span className={styles.brandMark}>NXT</span>
          <span className={styles.brandText}>Nextoken Capital</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/markets" className={styles.navLink}>Markets</Link>
          <Link href="/exchange" className={styles.navLink}>Exchange</Link>
          <Link href="/bonds" className={styles.navLink}>Bonds</Link>
          <Link href="/equity" className={styles.navLink}>Equity & IPO</Link>
          <Link href="/tokenize" className={styles.navLink}>Tokenize</Link>
        </nav>

<div className={styles.navActions}>
  <ConnectButton />

  <button className={styles.loginBtn}>Log In</button>
  <button className={styles.registerBtn}>Register</button>
</div>

        <button
          aria-label="Toggle menu"
          className={styles.menuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
          type="button"
        >
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu}>
          <Link href="/markets" className={styles.navLink}>Markets</Link>
          <Link href="/exchange" className={styles.navLink}>Exchange</Link>
          <Link href="/bonds" className={styles.navLink}>Bonds</Link>
          <Link href="/equity" className={styles.navLink}>Equity & IPO</Link>
          <Link href="/tokenize" className={styles.navLink}>Tokenize</Link>
        </nav>
      )}
    </header>
  );
}