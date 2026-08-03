import Navbar from "../../shared/components/Navbar";
import ServicesSection from "../../shared/components/ServicesSection";
import Hero from "../components/Hero";
import HowItWorks from "../../shared/components/HowItWorks";
import Reviews from "../components/Reviews";
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