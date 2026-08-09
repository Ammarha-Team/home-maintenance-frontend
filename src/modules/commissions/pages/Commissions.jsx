import { useState } from "react";

import CommissionsStats from "../components/CommissionsStats";
import CommissionFilters from "../components/CommissionFilters";
import CommissionsTable from "../components/CommissionsTable";

export default function Commissions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div
      dir="rtl"
      className="w-full px-6 py-5"
    >
      {/* ================= Header ================= */}
      <div className="mb-5">
        <h1 className="text-[24px] font-bold text-[#333]">
          عمولات الفنيين
        </h1>

        <p className="mt-1 text-[15px] text-[#9B9B9B]">
          إدارة وتسوية عمولات الفنيين الخاصة بالصيانة
        </p>
      </div>

      {/* ================= Stats ================= */}
      <div className="w-full">
        <CommissionsStats />
      </div>

      {/* ================= Table ================= */}
      <section className="mt-5 w-full overflow-hidden rounded-[8px] border border-[#E6E8ED] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.04)]">
        <CommissionFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <CommissionsTable
          search={search}
          statusFilter={statusFilter}
        />
      </section>
    </div>
  );
}``