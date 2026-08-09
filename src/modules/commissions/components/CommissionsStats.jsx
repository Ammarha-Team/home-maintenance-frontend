import {
  Banknote,
  CircleCheck,
  Clock3,
  Percent,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import { commissionsSummary } from "../constants/commissionsData";

export default function CommissionsStats() {
  const summary = commissionsSummary();

  return (
    <div
      dir="rtl"
      className="grid w-full grid-cols-4 gap-3"
    >
      {/* ================= أرباح الأسبوع ================= */}
      <div className="h-[98px] w-full rounded-[10px] border border-[#E8EAF0] bg-white px-4 py-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        <div className="flex h-full flex-col justify-between">

          {/* Top */}
          <div className="flex items-start justify-between">
            <p
              dir="ltr"
              className="text-[14px] font-bold leading-[36px] text-[#4A4A4A]"
            >
              {summary.weeklyRevenue ?? summary.total ?? 4250}{" "}
              <span className="text-[10px] font-medium">
                ج.م
              </span>
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#EEF3FD] text-[#4775C9]">
              <Banknote
                size={18}
                strokeWidth={2}
              />
            </span>
          </div>

          {/* Bottom */}
          <div
            dir="ltr"
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-1 rounded-full bg-[#EEF4FF] px-2.5 py-[5px] text-[10px] font-bold text-[#4775C9]">
              +12%
              <TrendingUp size={11} />
            </span>

            <p
              dir="rtl"
              className="text-[11px] text-[#888]"
            >
              أرباح الأسبوع
            </p>
          </div>
        </div>
      </div>

      {/* ================= نسبة العمولة ================= */}
      <div className="h-[98px] w-full rounded-[10px] border border-[#E8EAF0] bg-white px-4 py-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        <div className="flex h-full flex-col justify-between">

          {/* Top */}
          <div className="flex items-start justify-between">
            <p
              dir="ltr"
              className="text-[14px] font-bold leading-[36px] text-[#4A4A4A]"
            >
              {summary.commissionRate ?? 15}%
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FFF4DF] text-[#F3A623]">
              <Percent
                size={19}
                strokeWidth={2.5}
              />
            </span>
          </div>

          {/* Bottom */}
          <p
            dir="rtl"
            className="text-right text-[11px] text-[#888]"
          >
            نسبة العمولة (المتوسط)
          </p>
        </div>
      </div>

      {/* ================= العمولات المستحقة ================= */}
      <div className="h-[98px] w-full rounded-[10px] border border-[#E8EAF0] bg-white px-4 py-3 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        <div className="flex h-full flex-col justify-between">

          {/* Top */}
          <div className="flex items-start justify-between">
            <p
              dir="ltr"
              className="text-[14px] font-bold leading-[36px] text-[#D55A5A]"
            >
              {summary.pending ??
                summary.outstanding ??
                1120}{" "}
              <span className="text-[10px] font-medium">
                ج.م
              </span>
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FBE8E8] text-[#D55A5A]">
              <Clock3
                size={17}
                strokeWidth={2}
              />
            </span>
          </div>

          {/* Bottom */}
          <div
            dir="ltr"
            className="flex items-center justify-between"
          >
            <span
              dir="rtl"
              className="flex items-center gap-1 rounded-full bg-[#FBE8E8] px-2.5 py-[5px] text-[10px] font-bold text-[#C84D4D]"
            >
              متأخر
              <AlertTriangle size={10} />
            </span>

            <p
              dir="rtl"
              className="text-[11px] text-[#888]"
            >
              العمولة المستحقة
            </p>
          </div>
        </div>
      </div>

      {/* ================= حالة الدفع العامة ================= */}
      <div className="h-[98px] w-full rounded-[10px] border border-[#42A951] bg-[#4CAF50] px-4 py-3 text-white shadow-[0_2px_6px_rgba(76,175,80,0.22)]">
        <div className="flex h-full flex-col justify-between">

          {/* Top */}
          <div className="flex items-start justify-between">
            <p
              dir="rtl"
              className="text-[18px] font-bold leading-[36px] text-white"
            >
              جيدة
            </p>

            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white/20 text-white">
              <CircleCheck
                size={19}
                strokeWidth={2}
              />
            </span>
          </div>

          {/* Bottom */}
          <div
            dir="ltr"
            className="flex items-center justify-between"
          >
            <span
              dir="rtl"
              className="rounded-full bg-white/20 px-2.5 py-[5px] text-[10px] font-bold text-white"
            >
              85% مسدد
            </span>

            <p
              dir="rtl"
              className="text-[11px] text-white/90"
            >
              حالة الدفع العامة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}