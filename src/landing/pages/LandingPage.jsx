import Navbar from "../../shared/components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import ServicesSection from "../components/ServicesSection";
import howItWorks from "../components/HowItWorks";
import Reviews from "../components/Reviews";
import OurTechnicians from "../components/OurTechnicians";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <Reviews />
      <OurTechnicians />
    </>
  );


}