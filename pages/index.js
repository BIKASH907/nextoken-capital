import Head from "next/head";
import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import ServicesSection from "../components/ServicesSection";
import TrustSection from "../components/TrustSection";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital - Modern capital access, market insights, and financial services."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <Hero />
        <StatsSection />
        <ServicesSection />
        <TrustSection />
        <Footer />
      </div>
    </>
  );
}