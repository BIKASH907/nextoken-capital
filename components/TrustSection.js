import styles from "../styles/TrustSection.module.css";

export default function TrustSection() {
  return (
    <section className={styles.trustSection}>
      <div className={styles.container}>
        <div className={styles.trustBox}>
          <p className={styles.sectionLabel}>Why Nextoken Capital</p>
          <h2 className={styles.sectionTitleLight}>
            Security First. Compliance Built-In. Trust Automated.
          </h2>
          <p className={styles.sectionTextLight}>
            MiCA-compliant infrastructure with institutional custody, AI-powered KYC/AML,
            and audited smart contracts. Your assets are protected by multi-signature vaults
            and regulated custodians — not promises.
          </p>
        </div>
      </div>
    </section>
  );
}
