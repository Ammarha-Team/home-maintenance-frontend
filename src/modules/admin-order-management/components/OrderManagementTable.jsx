import OrderStatusBadge from "./OrderStatusBadge";

const orders = [
  {
    id: "#ORD-2023-001",
    client: "أحمد محمد",
    clientInitial: "أ",
    technician: "محمود علي",
    service: "صيانة سباكة",
    price: "150 ر.س",
    status: "قيد الانتظار",
    date: "10 أكتوبر، 10:30 ص",
  },
  {
    id: "#ORD-2023-003",
    client: "عمر عبدالله",
    clientInitial: "ع",
    technician: "سعيد يوسف",
    service: "تنظيف مكيفات",
    price: "300 ر.س",
    status: "مكتمل",
    date: "09 أكتوبر، 04:00 م",
  },
  {
    id: "#ORD-2023-002",
    client: "سارة خالد",
    clientInitial: "س",
    technician: "لم يحدد بعد",
    service: "إصلاح كهرباء",
    price: "------",
    status: "ملغي",
    date: "10 أكتوبر، 09:15 ص",
  },
  {
    id: "#ORD-2023-002",
    client: "سارة خالد",
    clientInitial: "س",
    technician: "لم يحدد بعد",
    service: "إصلاح كهرباء",
    price: "150 ر.س",
    status: "قيد الانتظار",
    date: "10 أكتوبر، 09:15 ص",
  },
  {
    id: "#ORD-2023-002",
    client: "سارة خالد",
    clientInitial: "س",
    technician: "لم يحدد بعد",
    service: "إصلاح كهرباء",
    price: "150 ر.س",
    status: "قيد الانتظار",
    date: "10 أكتوبر، 09:15 ص",
  },
  {
    id: "#ORD-2023-002",
    client: "سارة خالد",
    clientInitial: "س",
    technician: "لم يحدد بعد",
    service: "إصلاح كهرباء",
    price: "------",
    status: "ملغي",
    date: "10 أكتوبر، 09:15 ص",
  },
  {
    id: "#ORD-2023-002",
    client: "سارة خالد",
    clientInitial: "س",
    technician: "لم يحدد بعد",
    service: "إصلاح كهرباء",
    price: "------",
    status: "ملغي",
    date: "10 أكتوبر، 09:15 ص",
  },
  {
    id: "#ORD-2023-003",
    client: "عمر عبدالله",
    clientInitial: "ع",
    technician: "سعيد يوسف",
    service: "تنظيف مكيفات",
    price: "300 ر.س",
    status: "مكتمل",
    date: "09 أكتوبر، 04:00 م",
  },
];

export default function OrderManagementTable({ activeTab }) {
  const filteredOrders =
    activeTab === "الكل"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-right">
        {/* Table Header */}
        <thead>
          <tr className="h-[42px] border-b border-[#E1E5EB] bg-[#F8FAFC]">
            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              رقم الطلب
            </th>

            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              العميل
            </th>

            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              الفني
            </th>

            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              الخدمة
            </th>

            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              السعر
            </th>

            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              الحالة
            </th>

            <th className="px-3 text-[10px] font-medium text-[#4B5563]">
              التاريخ
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr
                key={`${order.id}-${index}`}
                className="
                  h-[50px]
                  border-b
                  border-[#E1E5EB]
                  bg-white
                  transition
                  hover:bg-[#FAFBFD]
                "
              >
                {/* Order ID */}
                <td className="px-3">
                  <button
                    type="button"
                    className="
                      text-[10px]
                      font-medium
                      text-[#2878D8]
                      hover:underline
                    "
                  >
                    {order.id}
                  </button>
                </td>

                {/* Client */}
                <td className="px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        flex
                        h-[23px]
                        w-[23px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#DCEAFF]
                        text-[9px]
                        font-medium
                        text-[#2878D8]
                      "
                    >
                      {order.clientInitial}
                    </span>

                    <span className="whitespace-nowrap text-[10px] text-[#374151]">
                      {order.client}
                    </span>
                  </div>
                </td>

                {/* Technician */}
                <td className="px-3 text-[10px] text-[#4B5563]">
                  {order.technician}
                </td>

                {/* Service */}
                <td className="px-3 text-[10px] text-[#374151]">
                  {order.service}
                </td>

                {/* Price */}
                <td className="px-3 text-[10px] text-[#374151]">
                  {order.price}
                </td>

                {/* Status */}
                <td className="px-3">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-3 text-[10px] text-[#4B5563]">
                  {order.date}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="h-[100px] text-center text-[11px] text-[#9CA3AF]"
              >
                لا توجد طلبات بهذه الحالة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}