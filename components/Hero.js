import styles from "../styles/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Capital Solutions for Modern Markets</p>
          <h1 className={styles.heroTitle}>
            Connecting Investors, Opportunities, and Financial Access
          </h1>
          <p className={styles.heroText}>
            Nextoken Capital delivers a modern platform experience for market access,
            capital solutions, investment visibility, and structured financial services.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Get Started</button>
            <button className={styles.secondaryBtn}>Explore Services</button>
          </div>
        </div>
      </div>
    </section>
  );
}