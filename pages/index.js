import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import ServicesSection from "../components/ServicesSection";
import TrustSection from "../components/TrustSection";
import Footer from "../components/Footer";
import LeadCapture from "../components/LeadCapture";
import TeamPartners from "../components/TeamPartners";

export default function Home() {
  return (
    <>
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
