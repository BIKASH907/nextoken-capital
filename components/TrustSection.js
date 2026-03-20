import styles from "../styles/TrustSection.module.css";

export default function TrustSection() {
  return (
    <section className={styles.trustSection}>
      <div className={styles.container}>
        <div className={styles.trustBox}>
          <p className={styles.sectionLabel}>Why Nextoken Capital</p>
          <h2 className={styles.sectionTitleLight}>
            Professional Design. Clear Structure. Trusted Experience.
          </h2>
          <p className={styles.sectionTextLight}>
            From onboarding to account access, every touchpoint is designed to feel
            consistent, secure, and easy to use across desktop and mobile.
          </p>
        </div>
      </div>
    </section>
  );
}