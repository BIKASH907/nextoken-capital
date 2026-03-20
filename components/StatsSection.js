import styles from "../styles/StatsSection.module.css";

export default function StatsSection() {
  const stats = [
    { number: "24/7", text: "Platform Access" },
    { number: "Global", text: "Investor Reach" },
    { number: "Secure", text: "Infrastructure" },
    { number: "Fast", text: "Client Onboarding" },
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