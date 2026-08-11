import { useState } from "react";
import OrderManagementHeader from "../components/OrderManagementHeader";
import OrderManagementTable from "../components/OrderManagementTable";
import OrderManagementPagination from "../components/OrderManagementPagination";

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("الكل");

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8F9FC]">
      <div className="m-auto w-full min-w-[1240px] px-5 py-5">

        <OrderManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="mt-4 overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white">
          <OrderManagementTable activeTab={activeTab} />

          <OrderManagementPagination />
        </div>

      </div>
    </main>
  );
}