import HomeNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import TechnicianCard from "../components/TechnicianCard";
import ReviewForm from "../components/ReviewForm";
import { CheckCircle } from "lucide-react";

export default function ReviewPage() {
  const technician = {
    name: "أحمد العناني",
    job: "إصلاح الأجهزة الكهربائية والسباكة",
    image: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <>
      <HomeNavbar />

      <main className="min-h-screen bg-[#F8F9FC] py-12">
        <div className="max-w-xl mx-auto flex flex-col items-center px-4">
          <div className="bg-green-100 rounded-full p-5">
            <CheckCircle className="text-green-600" size={55} />
          </div>

          <h2 className="text-2xl font-bold text-green-600 mt-4">
            تم اكتمال الخدمة بنجاح!
          </h2>

          <p className="text-gray-500 mt-2 text-center">
            شكراً لاختيارك لنا، نأمل أن تكون الخدمة نالت رضاك.
          </p>

          <TechnicianCard technician={technician} />

          <ReviewForm />
        </div>
      </main>

      <Footer />
    </>
  );
}