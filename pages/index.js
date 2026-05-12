import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import ServicesSection from "../components/ServicesSection";
import TrustSection from "../components/TrustSection";
import Footer from "../components/Footer";
import PageMeta from "../components/PageMeta";
import LeadCapture from "../components/LeadCapture";
import TeamPartners from "../components/TeamPartners";

export default function Home() {
  return (
    <>
      <PageMeta title="Home" description="Tokenized real-world asset marketplace. Buy fractional shares of real estate, bonds and energy projects directly on-chain. EU-regulated, non-custodial." />
      <Navbar />
      <Hero />
      <StatsSection />
      <ServicesSection />
      <TrustSection />
      <TeamPartners />
      <LeadCapture />
      <Footer />
    </>
  );
}
