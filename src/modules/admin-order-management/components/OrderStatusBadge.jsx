export default function OrderStatusBadge({ status }) {
  const statusStyles = {
    "قيد الانتظار": "bg-[#FFF3E0] text-[#F59E0B]",
    "تم قبول العرض": "bg-[#E8F0FE] text-[#2878D8]",
    "في الطريق": "bg-[#EAF4FF] text-[#2878D8]",
    "جاري التنفيذ": "bg-[#E8F0FE] text-[#2878D8]",
    مكتمل: "bg-[#E8F6EC] text-[#22A447]",
    ملغي: "bg-[#F9E8E8] text-[#DC5A5A]",
  };

  return (
    <span
      className={`
        inline-flex
        min-w-[58px]
        items-center
        justify-center
        rounded-full
        px-2
        py-[5px]
        text-[8px]
        font-medium
        leading-none
        whitespace-nowrap
        ${statusStyles[status] || "bg-gray-100 text-gray-500"}
      `}
    >
      {status}
    </span>
  );
}