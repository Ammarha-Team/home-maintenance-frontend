import CommissionsStats from "../components/CommissionsStats";
import CommissionFilters from "../components/CommissionFilters";
import CommissionsTable from "../components/CommissionsTable";

export default function Commissions() {
  return (
    <main dir="rtl" className="min-h-screen bg-white px-8 py-7">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-[#4A4A4A]">
          عمولات الفنيين
        </h1>

        <p className="mt-1 text-[11px] text-[#9B9B9B]">
          إدارة وتسوية عمولات الفنيين بناءً على أرباحهم
        </p>
      </div>

      {/* Statistics */}
      <CommissionsStats />

      {/* Commissions Table */}
      <section className="mt-4 overflow-hidden rounded-[8px] border border-[#E8EAF0] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.04)]">
        <CommissionFilters />
        <CommissionsTable />
      </section>
    </main>
  );
}