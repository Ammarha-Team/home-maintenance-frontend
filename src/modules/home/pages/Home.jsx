import UserNavbar from "../../../shared/components/HomeNavbar";
import ServicesSection from "../../../shared/components/ServicesSection";
import ChatBot from "../../../shared/components/ChatBot";
import HowItWorks from "../../../shared/components/HowItWorks";
import LocationHeader from "../components/LocationHeader";
import QuickActions from "../components/QuickActions";
import Footer from "../../../shared/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full space-y-6">
        <LocationHeader />
        <QuickActions />

        <ServicesSection />
        <HowItWorks />
      </main>

      <Footer />

      <ChatBot />
    </div>
  );
}