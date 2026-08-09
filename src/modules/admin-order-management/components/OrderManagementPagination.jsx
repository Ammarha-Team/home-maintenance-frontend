import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrderManagementPagination() {
  const [currentPage, setCurrentPage] = useState(1);

  const pages = [1, 2, 3];

  return (
    <div className="flex items-center justify-between border-t border-[#E1E5EB] bg-white px-4 py-3">
      {/* Results Count */}
      <span className="text-[10px] text-[#6B7280]">
        عرض 1 إلى 10 من 50 طلب
      </span>

      {/* Pagination */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`
            flex
            h-[25px]
            w-[25px]
            items-center
            justify-center
            rounded-[4px]
            border
            border-[#E1E5EB]
            bg-white
            text-[#6B7280]
            transition
            ${
              currentPage === 1
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-[#F5F7FA]"
            }
          `}
        >
          <ChevronRight size={12} strokeWidth={1.8} />
        </button>

        {/* Pages */}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`
              flex
              h-[25px]
              w-[25px]
              items-center
              justify-center
              rounded-[4px]
              text-[9px]
              transition
              ${
                currentPage === page
                  ? "bg-[#2878D8] text-white"
                  : "border border-[#E1E5EB] bg-white text-[#4B5563] hover:bg-[#F5F7FA]"
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === pages.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`
            flex
            h-[25px]
            w-[25px]
            items-center
            justify-center
            rounded-[4px]
            border
            border-[#E1E5EB]
            bg-white
            text-[#6B7280]
            transition
            ${
              currentPage === pages.length
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-[#F5F7FA]"
            }
          `}
        >
          <ChevronLeft size={12} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}