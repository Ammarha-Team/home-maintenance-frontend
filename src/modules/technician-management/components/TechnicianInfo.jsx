import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react";

const information = [
  {
    label: "رقم الهاتف",
    value: "+966 50 123 4567",
    icon: Phone,
  },
  {
    label: "البريد الإلكتروني",
    value: "ahmed.m@example.com",
    icon: Mail,
  },
  {
    label: "المدينة / العنوان",
    value: "الرياض - حي الياسمين",
    icon: MapPin,
  },
  {
    label: "سنوات الخبرة",
    value: "7 سنوات",
    icon: Briefcase,
  },
];

export default function TechnicianInfo() {
  return (
    <div className="h-fit rounded-[10px] border border-[#E8ECF2] bg-white px-5 py-5">
      {/* Profile */}
      <div className="flex flex-col items-center border-b border-[#EEF1F5] pb-5">
        <div className="relative">
          <img
            src="/technician_avatar.jpg"
            alt="أحمد محمود"
            className="h-[72px] w-[72px] rounded-full object-cover"
          />

          <span className="absolute bottom-[2px] left-[2px] h-[11px] w-[11px] rounded-full border-2 border-white bg-green-500" />
        </div>

        <h2 className="mt-3 text-[15px] font-bold text-text-500">
          أحمد محمود
        </h2>

        <span className="mt-2 rounded-full bg-primary-50 px-3 py-1 text-[9px] text-primary-500">
          فني صيانة عامة
        </span>
      </div>

      {/* Information */}
      <div className="space-y-4 pt-4">
        {information.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-3"
            >
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-primary-50">
                <Icon
                  size={15}
                  strokeWidth={1.8}
                  className="text-primary-500"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] text-text-300">
                  {item.label}
                </p>

                <p
                  dir={item.label === "رقم الهاتف" ? "ltr" : "rtl"}
                  className="mt-1 text-[10px] text-text-400"
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}