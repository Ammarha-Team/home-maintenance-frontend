import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

export default function OrderManagementFilters({
  activeTab,
  setActiveTab,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const filters = [
    "الكل",
    "قيد الانتظار",
    "تم قبول العرض",
    "في الطريق",
    "جاري التنفيذ",
    "مكتمل",
    "ملغي",
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <div className="relative w-[182px]">
        <Search
          size={20}
          strokeWidth={1.8}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />

        <input
          type="text"
          placeholder="بحث في الطلبات..."
          className="
            h-[35px]
            w-full
            rounded-[5px]
            border
            border-[#D9DEE7]
            bg-white
            pr-7
            pl-2
            text-[10px]
            text-[#374151]
            outline-none
            placeholder:text-[#9CA3AF]
            focus:border-[#2878D8]
          "
        />
      </div>

      {/* Filter */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex
            h-[35px]
            items-center
            gap-1.5
            rounded-[5px]
            border
            border-[#D9DEE7]
            bg-[#F8FAFD]
            px-2.5
            text-[10px]
            text-[#4B5563]
          "
        >
          <SlidersHorizontal size={10} strokeWidth={1.8} />

          <span>
            {activeTab === "الكل" ? "تصفية" : activeTab}
          </span>

          <ChevronDown
            size={11}
            className={isOpen ? "rotate-180" : ""}
          />
        </button>

        {isOpen && (
          <div
            className="
              absolute
              right-0
              top-[40px]
              z-50
              w-[155px]
              rounded-[6px]
              border
              border-[#D9DEE7]
              bg-white
              py-1
              shadow-md
            "
          >
            <div className="border-b border-[#EEF0F3] px-3 py-2 text-[10px] font-medium text-[#6B7280]">
              تصفية حسب الحالة
            </div>

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveTab(filter);
                  setIsOpen(false);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  px-3
                  py-2
                  text-right
                  text-[12px]
                  ${
                    activeTab === filter
                      ? "bg-[#EEF5FF] font-medium text-[#2878D8]"
                      : "text-[#4B5563]"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}