import { Loader2, RotateCw } from "lucide-react";

import HomeNavbar from "../../../shared/components/TechnicianNavbar";
import Footer from "../../../shared/components/Footer";

import ProfileHeader from "../components/ProfileHeader";
import PersonalInformation from "../components/PersonalInformation";
import ExperienceInformation from "../components/ExperienceInformation";
import Portfolio from "../components/Portfolio";
import Certificates from "../components/Certificates";

import { useTechnicianProfile } from "../hooks/useTechnicianProfile";

export default function TechnicianProfile() {
  const {
    profile,
    loading,
    error,
    reload,
    saving,
    saveError,
    fieldErrors,
    saveProfile,
    avatar,
    changeAvatar,
    portfolio,
    addPortfolioImages,
  } = useTechnicianProfile();

  return (
    <>
      <HomeNavbar />

      <main className="min-h-screen bg-[#F8F9FC] py-8">
        <div className="mx-auto w-full max-w-7xl px-6">

          {/* محتوى البروفايل بالكامل */}
          <div className="flex w-full flex-col gap-6">

            {/*
              The cards render off a record that is not there on the first
              paint, so the page holds its place until it is — rather than
              flashing empty inputs the user could start typing into before the
              real values arrive and replace them.
            */}
            {loading && (
              <div
                dir="rtl"
                className="flex items-center justify-center gap-3 rounded-xl border border-[#E6EAF0] bg-white py-20 text-[14px] text-[#777] shadow-sm"
              >
                <Loader2 size={18} className="animate-spin text-[#2878E8]" />
                جارٍ تحميل بيانات الملف الشخصي...
              </div>
            )}

            {!loading && error && (
              <div
                dir="rtl"
                className="flex flex-col items-center gap-4 rounded-xl border border-[#F3D2D2] bg-[#FEF6F6] px-6 py-16 text-center shadow-sm"
              >
                <p className="text-[14px] font-semibold text-[#B42318]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={reload}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#2878E8] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1769D5]"
                >
                  <RotateCw size={15} />
                  إعادة المحاولة
                </button>
              </div>
            )}

            {!loading && !error && profile && (
              <>
                <div className="w-full">
                  <ProfileHeader
                    profile={profile}
                    avatar={avatar}
                    onChangeAvatar={changeAvatar}
                  />
                </div>

                <div className="w-full">
                  <PersonalInformation
                    profile={profile}
                    saving={saving}
                    saveError={saveError}
                    fieldErrors={fieldErrors}
                    onSave={saveProfile}
                  />
                </div>

                <div className="w-full">
                  <ExperienceInformation profile={profile} />
                </div>

                <div className="w-full">
                  <Portfolio
                    items={profile.portfolio}
                    upload={portfolio}
                    onAddImages={addPortfolioImages}
                  />
                </div>

                <div className="w-full">
                  <Certificates />
                </div>
              </>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
