const NEUTRAL_STATUS = "bg-[#F1F3F7] text-[#777C84]";

// The colours the states are drawn in, keyed by what the API writes.
const STATUS_CLASS = {
  completed: "bg-[#EAF8EF] text-[#36A45A]",
  inprogress: "bg-[#FFF5E8] text-[#F59E0B]",
  pending: "bg-[#FFF5E8] text-[#F59E0B]",
  cancelled: "bg-[#FDECEC] text-[#E56B6B]",
};

const readDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("ar-EG");
};

/**
 * The technician's recent work, as the detail endpoint reports it.
 *
 * `recentRequests` is empty for every account on the server today and the API
 * publishes no schema for its rows, so the field names below are not confirmed:
 * each cell reads the couple of spellings the rest of the API uses and prints an
 * em dash when it finds neither. Nothing is made up to fill a column — an empty
 * list draws the row underneath that says the list is empty.
 */
export default function TechnicianOrders({ orders = [] }) {
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
            {orders.map((order, index) => {
              const status = order.status ?? order.requestStatus ?? "—";
              const statusClass =
                STATUS_CLASS[String(status).toLowerCase().replace(/\s/g, "")] ??
                NEUTRAL_STATUS;

              return (
                <tr
                  key={order.id ?? index}
                  className="h-[39px] border-t border-[#EEF1F5]"
                >
                  <td className="truncate px-2 text-center text-[9px] font-medium text-[#2879F6]">
                    {order.id ? `#${order.id}` : "—"}
                  </td>

                  <td className="truncate px-2 text-center text-[9px] text-[#777C84]">
                    {order.clientName ?? order.client ?? "—"}
                  </td>

                  <td className="truncate px-2 text-center text-[9px] text-[#777C84]">
                    {order.serviceName ?? order.professionName ?? order.title ?? "—"}
                  </td>

                  <td
                    dir="ltr"
                    className="px-2 text-center text-[8px] text-[#8C929B]"
                  >
                    {readDate(order.createdAt ?? order.date)}
                  </td>

                  <td className="px-2 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-[3px] text-[8px] font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 ? (
              <tr className="border-t border-[#EEF1F5]">
                <td
                  colSpan={5}
                  className="px-2 py-6 text-center text-[10px] text-[#8C929B]"
                >
                  لا توجد طلبات حديثة لهذا الفني.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}