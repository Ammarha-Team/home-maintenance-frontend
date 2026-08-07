import HomeNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import RestrictionHeader from "../components/RestrictionHeader";
import OutstandingCard from "../components/OutstandingCard";
import RestrictionNotice from "../components/RestrictionNotice";
import RestrictionActions from "../components/RestrictionActions";

export default function AccountRestricted() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <HomeNavbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-4">

          <RestrictionHeader />

          <OutstandingCard />

          <RestrictionNotice />

          <RestrictionActions />

        </div>
      </main>

      <Footer />
    </div>
  );
}