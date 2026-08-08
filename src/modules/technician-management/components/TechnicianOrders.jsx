const orders = [
  {
    id: "#ORD-9082",
    client: "سالم عبدالله",
    service: "إصلاح تسريب مياه",
    date: "24 Oct, 10:30",
    status: "مكتمل",
    statusClass: "bg-[#EAF8EF] text-[#36A45A]",
  },
  {
    id: "#ORD-9085",
    client: "محمد أحمد",
    service: "تركيب خلاط دش",
    date: "23 Oct, 14:00",
    status: "مكتمل",
    statusClass: "bg-[#EAF8EF] text-[#36A45A]",
  },
  {
    id: "#ORD-9102",
    client: "فهد العتيبي",
    service: "صيانة سخان مياه",
    date: "22 Oct, 09:15",
    status: "قيد التنفيذ",
    statusClass: "bg-[#FFF5E8] text-[#F59E0B]",
  },
  {
    id: "#ORD-8990",
    client: "نورة خالد",
    service: "تأسيس سباكة مطبخ",
    date: "20 Oct, 16:45",
    status: "ملغي",
    statusClass: "bg-[#FDECEC] text-[#E56B6B]",
  },
];

export default function TechnicianOrders() {
  return (
    <div className="overflow-hidden rounded-[9px] border border-[#E8ECF2] bg-white">
      {/* Header */}
      <div className="flex h-[43px] items-center justify-between border-b border-[#E8ECF2] px-4">
        <h2 className="text-[12px] font-bold text-[#55585D]">
          الطلبات الأخيرة
        </h2>

        <button
          type="button"
          className="text-[10px] font-medium text-[#2879F6]"
        >
          عرض الكل <span className="mr-1">‹</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] table-fixed">
          <thead>
            <tr className="h-[31px] bg-[#F7F9FC]">
              <th className="w-[19%] px-2 text-[9px] font-medium text-[#8C929B]">
                رقم الطلب
              </th>

              <th className="w-[19%] px-2 text-[9px] font-medium text-[#8C929B]">
                العميل
              </th>

              <th className="w-[25%] px-2 text-[9px] font-medium text-[#8C929B]">
                الخدمة
              </th>

              <th className="w-[19%] px-2 text-[9px] font-medium text-[#8C929B]">
                التاريخ
              </th>

              <th className="w-[18%] px-2 text-[9px] font-medium text-[#8C929B]">
                الحالة
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="h-[39px] border-t border-[#EEF1F5]"
              >
                <td className="truncate px-2 text-center text-[9px] font-medium text-[#2879F6]">
                  {order.id}
                </td>

                <td className="truncate px-2 text-center text-[9px] text-[#777C84]">
                  {order.client}
                </td>

                <td className="truncate px-2 text-center text-[9px] text-[#777C84]">
                  {order.service}
                </td>

                <td
                  dir="ltr"
                  className="px-2 text-center text-[8px] text-[#8C929B]"
                >
                  {order.date}
                </td>

                <td className="px-2 text-center">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-[3px] text-[8px] font-medium ${order.statusClass}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}