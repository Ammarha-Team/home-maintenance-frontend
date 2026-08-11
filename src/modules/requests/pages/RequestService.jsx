import ServiceSelector from "../components/ServiceSelector";
import ProblemDescription from "../components/ProblemDescription";
import UploadImages from "../components/UploadImages";
import HiringMethod from "../components/HiringMethod.jsx";
import SubmitRequest from "../components/SubmitRequest";

export default function RequestService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            طلب خدمة
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <ServiceSelector />
          <ProblemDescription />
          <UploadImages />
          <HiringMethod />
          <SubmitRequest />
        </div>

      </div>
    </div>
  );
}