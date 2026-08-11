import { ArrowUpRight } from "lucide-react";

export default function ServiceStats({
  totalOffers,
  acceptedOffers,
  pendingOffers,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 mb-15 mt-5">
      {/* قيد المراجعة */}
      <div className="col-span-12 lg:col-span-3 h-[120px] rounded-2xl bg-[#FFF7ED] border border-[#F3E8D7] px-6 py-5 flex flex-col justify-between text-right">
        <p className="text-[18px] font-medium text-[#6B7280]">
          قيد المراجعة
        </p>

        <h2 className="text-[40px] font-bold text-[#DC2626] leading-none">
          {pendingOffers}
        </h2>
      </div>

      {/* تم قبولها */}
      <div className="col-span-12 lg:col-span-3 h-[120px] rounded-2xl bg-[#EEF8F1] border border-[#DDEFE4] px-6 py-5 flex flex-col justify-between text-right">
        <p className="text-[18px] font-medium text-[#6B7280]">
          تم قبولها
        </p>

        <h2 className="text-[40px] font-bold text-[#16A34A] leading-none">
          {acceptedOffers}
        </h2>
      </div>

      {/* إجمالي العروض */}
      <div className="relative col-span-12 lg:col-span-6 h-[120px] rounded-2xl bg-[#4F83F1] px-6 py-5 overflow-hidden">
        <div className="text-right">
          <p className="text-[18px] font-medium text-white">
            إجمالي العروض المرسلة
          </p>

          <h2 className="mt-2 text-[40px] font-bold text-white leading-none">
            {totalOffers}
          </h2>
        </div>

        <ArrowUpRight
          size={58}
          strokeWidth={1.8}
          className="absolute left-5 bottom-4 text-white/20"
        />
      </div>
    </div>
  );
}