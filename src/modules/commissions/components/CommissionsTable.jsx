import { useEffect, useMemo } from "react";

import { COMMISSIONS } from "../constants/commissionsData";

export default function CommissionsTable({
  search = "",
  statusFilter = "all",
}) {
  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return COMMISSIONS.filter((item) => {

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

        const matchesSearch =
        item.technician.toLowerCase().includes(normalizedSearch) ||
        item.code.toLowerCase().includes(normalizedSearch);
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  /* ================= Export ================= */
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
    <div dir="rtl" className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        {/* ================= Header ================= */}
        <thead>
          <tr className="h-[40px] border-y border-[#E4E7EE] bg-[#F7F8FC]">
            <th className="w-[15%] px-4 text-right text-[10px] font-medium text-[#666]">
              الأسبوع
            </th>

            <th className="w-[20%] px-4 text-right text-[10px] font-medium text-[#666]">
              الفني
            </th>

            <th className="w-[16%] px-4 text-right text-[10px] font-medium text-[#666]">
              إجمالي الأرباح
            </th>

            <th className="w-[16%] px-4 text-right text-[10px] font-medium text-[#666]">
              العمولة
            </th>

            <th className="w-[17%] px-4 text-right text-[10px] font-medium text-[#666]">
              تاريخ الاستحقاق
            </th>

            <th className="w-[16%] px-4 text-center text-[10px] font-medium text-[#666]">
              حالة السداد
            </th>
          </tr>
        </thead>

        {/* ================= Body ================= */}
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr
                key={item.id}
                className="h-[65px] border-b border-[#F0F1F4] last:border-b-0"
              >
                {/* الأسبوع */}
                <td className="px-4 align-middle">
                  <div className="text-right">
                    <p className="text-[10px] font-medium leading-[16px] text-[#444]">
                      {item.week}
                    </p>

                    <p className="text-[9px] leading-[15px] text-[#999]">
                      {item.date}
                    </p>
                  </div>
                </td>

                {/* الفني */}
                <td className="px-4 align-middle">
                  <div className="flex items-center justify-start gap-2">
                    {/* الاسم والكود */}
                    <div className="min-w-0 text-right">
                      <p className="truncate text-[10px] font-medium leading-[16px] text-[#444]">
                        {item.technician}
                      </p>

                      <p
                        dir="ltr"
                        className="text-[8px] leading-[14px] text-[#888]"
                      >
                        {item.code}
                      </p>
                    </div>

                    {/* Avatar */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DCE8FF] text-[9px] font-semibold text-[#4775C9]">
                      {item.initials}
                    </div>
                  </div>
                </td>

                {/* إجمالي الأرباح */}
                <td className="px-4 align-middle text-right">
                  <span
                    dir="ltr"
                    className="text-[10px] font-medium text-[#333]"
                  >
                    {item.earnings} ج.م
                  </span>
                </td>

                {/* العمولة */}
                <td className="px-4 align-middle text-right">
                  <span
                    dir="ltr"
                    className="text-[9px] text-[#555]"
                  >
                    {item.commission} ج.م
                  </span>

                  <span className="mr-1 text-[8px] text-[#999]">
                    (15%)
                  </span>
                </td>

                {/* تاريخ الاستحقاق */}
                <td className="px-4 align-middle text-right">
                  {item.status === "pending" ? (
                    <span
                      dir="ltr"
                      className="text-[9px] tracking-[1px] text-[#999]"
                    >
                      ----------
                    </span>
                  ) : (
                    <span className="text-[9px] text-[#666]">
                      {item.dueDate}
                    </span>
                  )}
                </td>

                {/* حالة السداد */}
                <td className="px-4 align-middle text-center">
                  <span
                    className={`inline-flex min-w-[68px] items-center justify-center rounded-full px-3 py-[5px] text-[8px] font-medium ${
                      item.status === "paid"
                        ? "bg-[#E8F6EC] text-[#4BA35A]"
                        : "bg-[#F8E8E8] text-[#D55A5A]"
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
                colSpan={6}
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