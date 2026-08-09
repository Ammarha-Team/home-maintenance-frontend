import { RotateCcw } from "lucide-react";

export default function TechnicianAccountStatus() {
  return (
    <div
      dir="rtl"
      className="mt-4 flex h-[58px] w-full items-center justify-between rounded-[9px] border border-[#BFD6FF] bg-[#EDF4FF] px-6"
    >
      {/* Text */}
      <p className="text-[11px] font-medium text-text-400">
        لقد تم سداد مستحقات هذا الأسبوع من 11-14 أكتوبر بنجاح
      </p>

      {/* Button */}
      <button
        type="button"
        className="flex h-[32px] items-center justify-center gap-1.5 rounded-[7px] bg-primary-500 px-3 text-[10px] font-medium text-white transition hover:bg-primary-600"
      >
        <RotateCcw size={13} />
        إعادة تنشيط الحساب
      </button>
    </div>
  );
}