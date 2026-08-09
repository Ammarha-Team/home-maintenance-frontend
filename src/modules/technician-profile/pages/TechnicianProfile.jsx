import HomeNavbar from "../../../shared/components/TechnicianNavbar";
import Footer from "../../../shared/components/Footer";

import ProfileHeader from "../components/ProfileHeader";
import PersonalInformation from "../components/PersonalInformation";
import ExperienceInformation from "../components/ExperienceInformation";
import Portfolio from "../components/Portfolio";
import Certificates from "../components/Certificates";

export default function TechnicianProfile() {
  return (
    <>
      <HomeNavbar />

      <main className="min-h-screen bg-[#F8F9FC] py-8">
        <div className="mx-auto w-full max-w-7xl px-6">

          {/* محتوى البروفايل بالكامل */}
          <div className="flex w-full flex-col gap-6">

            <div className="w-full">
              <ProfileHeader />
            </div>

            <div className="w-full">
              <PersonalInformation />
            </div>

            <div className="w-full">
              <ExperienceInformation />
            </div>

            <div className="w-full">
              <Portfolio />
            </div>

            <div className="w-full">
              <Certificates />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}