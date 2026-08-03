import Navbar from "../../shared/components/Navbar";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import Reviews from "../components/Reviews";
import OurTechnicians from "../components/OurTechnicians";
import DownloadSection from "../components/DownloadSection";
import Footer from "../../shared/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <Reviews />
      <OurTechnicians />
      <DownloadSection />
      <Footer />
    </>
  );
}