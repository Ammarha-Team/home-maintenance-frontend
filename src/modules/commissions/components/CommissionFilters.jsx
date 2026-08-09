import { useState } from "react";
import {
  Search,
  Download,
  ChevronDown,
} from "lucide-react";

export default function CommissionFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleExport = () => {
    window.dispatchEvent(new Event("export-commissions"));
  };

  return (
    <div className="flex items-center justify-between border-b border-[#ECEEF3] px-4 py-3">
      
      {/* Left Buttons */}
      <div className="flex items-center gap-2">
        
        {/* Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="flex h-8 items-center gap-1.5 rounded-md border border-[#E2E5EB] bg-white px-3 text-[10px] text-[#666] transition hover:bg-[#F8F9FC]"
          >
            <span>تصفية</span>

            <ChevronDown
              size={12}
              className={`transition-transform ${
                filterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-10 z-20 w-[130px] rounded-md border border-[#E5E7EB] bg-white p-1.5 shadow-lg">
              
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setFilterOpen(false);
                }}
                className="w-full rounded px-2 py-2 text-right text-[10px] text-[#555] hover:bg-[#F5F7FA]"
              >
                الكل
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("paid");
                  setFilterOpen(false);
                }}
                className="w-full rounded px-2 py-2 text-right text-[10px] text-[#555] hover:bg-[#F5F7FA]"
              >
                مسدد
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("pending");
                  setFilterOpen(false);
                }}
                className="w-full rounded px-2 py-2 text-right text-[10px] text-[#555] hover:bg-[#F5F7FA]"
              >
                مستحق
              </button>
            </div>
          )}
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={handleExport}
          className="flex h-8 items-center gap-1.5 rounded-md border border-[#E2E5EB] bg-white px-3 text-[10px] text-[#666] transition hover:bg-[#F8F9FC]"
        >
          <Download size={13} />
          <span>تصدير</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-[240px]">
        <Search
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A4A7AE]"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="البحث باسم الفني..."
          className="h-8 w-full rounded-md border border-[#E3E5EA] bg-white pr-8 pl-3 text-[10px] text-[#555] outline-none placeholder:text-[#B0B2B8] focus:border-[#B9CBEF]"
        />
      </div>
    </div>
  );
}