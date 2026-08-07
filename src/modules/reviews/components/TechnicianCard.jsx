import { BadgeCheck } from "lucide-react";

export default function TechnicianCard({ technician }) {
  return (
    <div
      dir="rtl"
      className="mt-8 w-full max-w-[500px] rounded-xl border border-gray-100 bg-white shadow-sm px-5 py-4 flex items-center"
    >
      {/* صورة الفني */}
      <div className="relative shrink-0">
        <img
          src={technician.image}
          alt={technician.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />

        <BadgeCheck
          size={16}
          className="absolute -bottom-1 -right-1 text-green-500 fill-white"
        />
      </div>

      {/* بيانات الفني */}
      <div className="mr-4 text-right">
        <h3 className="text-[16px] font-bold text-gray-800">
          {technician.name}
        </h3>

        <p className="mt-1 text-[13px] text-gray-500">
          {technician.job}
        </p>
      </div>
    </div>
  );
}