import {
  Snowflake,
  WashingMachine,
  Refrigerator,
  Wrench,
  Zap,
  Sparkles,
} from "lucide-react";

const services = [
  { name: "تكييف", icon: Snowflake },
  { name: "غسالات", icon: WashingMachine },
  { name: "ثلاجات", icon: Refrigerator },
  { name: "سباكة", icon: Wrench },
  { name: "كهرباء", icon: Zap },
  { name: "تنظيف", icon: Sparkles },
];

export default function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 py-16" dir="rtl">
      <div className="container mx-auto px-6">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              خدماتنا المميزة
            </h2>

            <p className="text-gray-500 mt-2">
              اختر الخدمة التي تحتاجها ودع الباقي علينا
            </p>
          </div>

          <button className="text-blue-600 font-medium">
            عرض الكل
          </button>
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="
                border border-gray-200
                rounded-xl
                h-20
                flex
                flex-col
                items-center
                justify-center
                gap-2
                hover:shadow-sm
                transition
                "
              >
                <div className="bg-blue-50 p-2 rounded-full">
                  <Icon size={20} className="text-blue-600"/>
                </div>

                <span className="text-sm text-gray-700">
                  {service.name}
                </span>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}