import styles from "../styles/StatsSection.module.css";

export default function StatsSection() {
  const stats = [
    { number: "0.25%", text: "Trading Fee" },
    { number: "24/7", text: "Market Access" },
    { number: "T+0", text: "Settlement Time" },
    { number: "MiCA", text: "EU Compliant" },
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((item) => (
            <div key={item.text} className={styles.statCard}>
              <h3 className={styles.statNumber}>{item.number}</h3>
              <p className={styles.statText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
