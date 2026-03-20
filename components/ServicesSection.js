import ServiceCard from "./ServiceCard";
import styles from "../styles/ServicesSection.module.css";

export default function ServicesSection() {
  const services = [
    {
      title: "Market Access",
      text: "Access a digital-first environment built to support financial visibility and participation across modern markets.",
    },
    {
      title: "Capital Solutions",
      text: "Explore structured opportunities designed to connect capital with business and investor needs.",
    },
    {
      title: "Equity & IPO",
      text: "Engage with public and private market opportunities through a clean, modern user experience.",
    },
    {
      title: "Client Support",
      text: "Benefit from a platform model focused on transparency, responsiveness, and service continuity.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Our Services</p>
          <h2 className={styles.sectionTitle}>Built for Access, Clarity, and Confidence</h2>
          <p className={styles.sectionText}>
            A streamlined digital experience designed for clients seeking structured
            financial access and a professional capital platform.
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