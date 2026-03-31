import Link from "next/link";
import styles from "../styles/Hero.module.css";
export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>The Regulated RWA Marketplace</p>
          <h1 className={styles.heroTitle}>
            Real-World Assets, Reimagined. Trade Tokenized Digital Assets 24/7.
          </h1>
          <p className={styles.heroText}>
            Nextoken Capital is a structured digital marketplace for tokenized real-world
            assets — from bonds and equities to real estate and commodities. Issue, trade,
            and settle with institutional-grade security and MiCA compliance.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/markets" className={styles.primaryBtn}>Explore Marketplace</Link>
            <Link href="/register" className={styles.secondaryBtn}>List an Asset</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
