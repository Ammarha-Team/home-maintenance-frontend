import { X } from "lucide-react";
import ServiceSelector from "./ServiceSelector";
import ProblemDescription from "./ProblemDescription";
import UploadImages from "./UploadImages";
import ScheduleSection from "./ScheduleSection";
import HiringMethod  from "./HiringMethod.jsx";
import SubmitRequest from "./SubmitRequest";
export default function RequestServiceModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}

            <div className="flex items-center px-6 py-4 border-b border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800">
    طلب خدمة
  </h2>

  <button
    onClick={onClose}
    className="mr-auto w-9 h-9 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
  >
    <X size={18} />
  </button>
</div>

        {/* Body */}
        <div className="p-6 space-y-6">

          <ServiceSelector />
          <ProblemDescription />
          <UploadImages />
          <ScheduleSection />
          <HiringMethod /> 
          <SubmitRequest />
        </div>

      </div>

    </div>
  );
}