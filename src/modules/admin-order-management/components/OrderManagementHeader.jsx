import OrderManagementFilters from "./OrderManagementFilters";

export default function OrderManagementHeader({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    "الكل",
    "قيد الانتظار",
    "تم قبول العرض",
    "في الطريق",
    "جاري التنفيذ",
    "مكتمل",
    "ملغي",
  ];

  return (
    <section>
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-[16px] font-bold leading-none text-[#202124]">
          إدارة الطلبات
        </h1>

        <OrderManagementFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Status Tabs */}
      <div
        className="
          mt-[10px]
          flex
          h-[45px]
          items-center
          rounded-[5px]
          border
          border-[#D9DEE7]
          bg-white
          px-[5px]
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`
              h-[28px]
              rounded-[4px]
              px-[15px]
              text-[13px]
              font-normal
              leading-none
              whitespace-nowrap
              cursor-pointer
              ${
                activeTab === tab
                  ? "bg-[#2878D8] text-white"
                  : "bg-transparent text-[#555D68] hover:text-[#2878D8]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
}