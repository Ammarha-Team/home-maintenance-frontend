import {
  ClipboardList,
  CheckCircle,
  Star,
} from "lucide-react";

const defaultStats = [
  {
    title: "إجمالي الطلبات",
    value: "342",
    description: "+12% هذا الشهر",
    icon: ClipboardList,
    iconClass: "text-primary-500",
    badge: true,
  },
  {
    title: "الطلبات المكتملة",
    value: "315",
    description: "92% نسبة الإنجاز",
    icon: CheckCircle,
    iconClass: "text-green-500",
  },
  {
    title: "متوسط التقييم",
    value: "4.8",
    description: "من 280 تقييم",
    icon: Star,
    iconClass: "text-yellow-500",
  },
];

export default function TechnicianStats({ stats = defaultStats }) {
  return (
    <div dir="rtl" className="grid w-full grid-cols-3 gap-[10px]">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="h-[150px] rounded-[10px] border border-[#E8ECF2] bg-white px-4 py-3"
          >
            {/* Title + Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-normal text-[#777C84]">
                {stat.title}
              </span>

              <Icon
                size={20}
                strokeWidth={1.8}
                className={stat.iconClass}
              />
            </div>

            {/* Value */}
            <div className="mt-[12px] flex items-end justify-start">
              {stat.title === "متوسط التقييم" ? (
                <div className="flex items-end gap-[4px]">
                  <span className="text-[27px] font-bold leading-none text-[#454545]">
                    {stat.value}
                  </span>

                  <span className="mb-[3px] text-[11px] text-[#777C84]">
                    / 5
                  </span>
                </div>
              ) : (
                <span className="text-[27px] font-bold leading-none text-[#454545]">
                  {stat.value}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-[7px] flex justify-start">
              {stat.badge ? (
                <span className="rounded-full bg-[#EAF8EE] px-[9px] py-[3px] text-[10px] font-medium text-[#35B65B]">
                  {stat.description}
                </span>
              ) : (
                <p className="text-[10px] text-[#777C84]">
                  {stat.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}