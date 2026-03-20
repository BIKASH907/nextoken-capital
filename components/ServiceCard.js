import styles from "../styles/ServicesSection.module.css";

export default function ServiceCard({ title, text }) {
  return (
    <div className={styles.serviceCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{text}</p>
    </div>
  );
}