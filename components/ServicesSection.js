import ServiceCard from "./ServiceCard";
import styles from "../styles/ServicesSection.module.css";

export default function ServicesSection() {
  const services = [
    {
      title: "Tokenized Bonds",
      text: "Trade sovereign and corporate bonds as digital tokens with instant settlement and transparent pricing on-chain.",
    },
    {
      title: "Fractional Real Estate",
      text: "Access residential and commercial property shares starting from €100 — global real estate, fractionalized and liquid.",
    },
    {
      title: "Equity & IPO",
      text: "Participate in blockchain-native IPOs and trade equity tokens of high-growth European ventures on our secondary market.",
    },
    {
      title: "Commodity Tokens",
      text: "Invest in digitized agricultural and industrial commodities with full traceability and regulated custody.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Marketplace</p>
          <h2 className={styles.sectionTitle}>Trade Real-World Assets On-Chain</h2>
          <p className={styles.sectionText}>
            A curated selection of yield-bearing tokenized assets. Each listing undergoes
            a rigorous 5-point verification process before reaching our exchange.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              text={service.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
