import { useEffect, useMemo } from "react";

const commissionsData = [
  {
    id: 1,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "25 أغسطس 2023",
    status: "paid",
  },
  {
    id: 2,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "25 أغسطس 2023",
    status: "paid",
  },
  {
    id: 3,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "--------",
    status: "pending",
  },
  {
    id: 4,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "--------",
    status: "pending",
  },
];

export default function CommissionsTable({
  search,
  statusFilter,
}) {
  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return commissionsData.filter((item) => {
      const matchesSearch =
        item.technician.toLowerCase().includes(normalizedSearch) ||
        item.code.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  useEffect(() => {
    const handleExport = () => {
      const headers = [
        "الأسبوع",
        "الفني",
        "إجمالي الأرباح",
        "العمولة",
        "تاريخ الاستحقاق",
        "حالة السداد",
      ];

      const rows = filteredData.map((item) => [
        `${item.week} ${item.date}`,
        item.technician,
        `${item.earnings} ج.م`,
        `${item.commission} ج.م`,
        item.dueDate,
        item.status === "paid" ? "مسدد" : "مستحق",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((value) => `"${value}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob(
        ["\uFEFF" + csvContent],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "commissions.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };

    window.addEventListener(
      "export-commissions",
      handleExport
    );

    return () => {
      window.removeEventListener(
        "export-commissions",
        handleExport
      );
    };
  }, [filteredData]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px] border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="h-[32px] border-b border-[#ECEEF3] bg-[#F7F8FC]">
            <th className="px-3 text-right text-[9px] font-medium text-[#777]">
              الأسبوع
            </th>

            <th className="px-3 text-right text-[9px] font-medium text-[#777]">
              الفني
            </th>

            <th className="px-3 text-right text-[9px] font-medium text-[#777]">
              إجمالي الأرباح
            </th>

            <th className="px-3 text-right text-[9px] font-medium text-[#777]">
              العمولة
            </th>

            <th className="px-3 text-right text-[9px] font-medium text-[#777]">
              تاريخ الاستحقاق
            </th>

            <th className="px-3 text-center text-[9px] font-medium text-[#777]">
              حالة السداد
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr
                key={item.id}
                className="h-[50px] border-b border-[#F0F1F4] last:border-b-0 hover:bg-[#FCFCFD]"
              >
                {/* Week */}
                <td className="px-3">
                  <div className="text-right">
                    <p className="text-[9px] font-medium text-[#4D4D4D]">
                      {item.week}
                    </p>

                    <p className="mt-0.5 text-[8px] text-[#999]">
                      {item.date}
                    </p>
                  </div>
                </td>

                {/* Technician */}
                <td className="px-3">
                  <div className="flex items-center justify-start gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DCE8FF] text-[8px] font-semibold text-[#4775C9]">
                      {item.initials}
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-medium text-[#4D4D4D]">
                        {item.technician}
                      </p>

                      <p className="mt-0.5 text-[7px] text-[#888]">
                        {item.code}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Earnings */}
                <td className="px-3 text-right">
                  <span className="text-[9px] font-medium text-[#4B4B4B]">
                    {item.earnings} ج.م
                  </span>
                </td>

                {/* Commission */}
                <td className="px-3 text-right">
                  <span className="text-[9px] text-[#555]">
                    {item.commission} ج.م
                  </span>

                  <span className="mr-1 text-[7px] text-[#999]">
                    (15%)
                  </span>
                </td>

                {/* Due Date */}
                <td className="px-3 text-right">
                  <span
                    className={`text-[8px] ${
                      item.status === "pending"
                        ? "text-[#A5A5A5]"
                        : "text-[#666]"
                    }`}
                  >
                    {item.dueDate}
                  </span>
                </td>

                {/* Status */}
                <td className="px-3 text-center">
                  <span
                    className={`inline-flex min-w-[48px] items-center justify-center rounded-full px-2 py-1 text-[8px] font-medium ${
                      item.status === "paid"
                        ? "bg-[#E7F5EB] text-[#4BA35A]"
                        : "bg-[#FBE8E8] text-[#D55A5A]"
                    }`}
                  >
                    {item.status === "paid"
                      ? "مسدد"
                      : "مستحق"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="h-[150px] text-center text-[11px] text-[#999]"
              >
                لا توجد نتائج
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}