import TechnicianStats from "../components/TechnicianStats";
import TechnicianInfo from "../components/TechnicianInfo";
import TechnicianOrders from "../components/TechnicianOrders";
import TechnicianAccountStatus from "../components/TechnicianAccountStatus";

export default function TechnicianSummary() {
  return (
    <div dir="rtl" className="w-full">
      {/* Header */}
      <div className="mx-auto mb-5 max-w-[1200px]">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px]">
              <span className="text-text-400">
                الفنيين
              </span>

              <span className="text-text-200">/</span>

              <span className="font-medium text-primary-500">
                تفاصيل الفني
              </span>
            </div>

            <h1 className="text-[18px] font-bold text-text-500">
              ملف الفني: أحمد محمود
            </h1>
          </div>

          <button
            type="button"
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-red-100 bg-white px-4 text-[11px] font-medium text-red-500"
          >
            إيقاف الحساب
            <span className="text-[13px]">⊘</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        
        {/* Technician Info */}
        <TechnicianInfo />

        {/* Stats + Orders + Account Status */}
        <div className="min-w-0">
          <TechnicianStats />

          <div className="mt-4">
            <TechnicianOrders />
          </div>

 
        </div>


      </div>

       <div className="mt-10">
            <TechnicianAccountStatus />
          </div>
    </div>
  );
}