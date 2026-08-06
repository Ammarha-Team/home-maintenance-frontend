import {
  X,
  Check,
  UserRound,
  Star,
  Wallet,
} from "lucide-react";

export default function TechnicianNotificationPanel({ open, onClose }) {
  if (!open) return null;

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "تم قبول عرضك بنجاح",
      desc: "لقد تم قبول عرضك في مهمة تركيب خلاط المطبخ الموجود في آخر التنفيذ",
      time: "أمس",
      icon: Check,
      button: "ابدأ الخدمة الآن",
    },
    {
      id: 2,
      type: "request",
      title: "طلب جديد",
      desc: "لديك طلب جديد يحتاج للمراجعة من عميل في منطقة النزهة",
      time: "منذ 5 دقائق",
      icon: UserRound,
    },
    {
      id: 3,
      type: "payment",
      title: "تم دفع الدفعة",
      desc: "تم دفع الدفعة الخاصة بالخدمة بنجاح ويمكنك متابعة تنفيذ الطلب",
      time: "أمس",
      icon: Wallet,
      button: "عرض التفاصيل",
    },
    {
      id: 4,
      type: "offer",
      title: "عرض خاص للفنيين",
      desc: "احصل على خصم مميز عند الاشتراك السنوي",
      time: "منذ ساعتين",
      icon: Star,
      button: "الحصول عليه",
    },
  ];

  const colors = {
    success: "bg-green-500",
    request: "bg-orange-400",
    payment: "bg-purple-500",
    offer: "bg-blue-600",
  };

  return (
    <div
      dir="rtl"
      className="
        w-[500px]
        max-h-[82vh]
        overflow-y-auto
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="relative flex h-16 items-center justify-center border-b">
        <h2 className="text-[28px] font-bold text-gray-800">
          الإشعارات
        </h2>

        <button
          onClick={onClose}
          className="absolute left-4 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-400"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            مركز الإشعارات والتنبيهات
          </span>

          <button className="rounded-md border px-3 py-1 text-xs text-gray-500 hover:bg-gray-50">
            ✓ تحديد الكل كمقروء
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`rounded-xl border px-4 py-4 ${
                  item.id === 1
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${colors[item.type]}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-[17px] font-bold text-gray-800">
                        {item.title}
                      </h3>

                      <span className="text-xs text-gray-400">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-gray-500">
                      {item.desc}
                    </p>

                    {item.type === "request" ? (
                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white">
                          عرض الطلب
                        </button>

                        <button className="w-28 rounded-md border border-red-300 py-2.5 text-sm font-medium text-red-500">
                          تجاهل
                        </button>
                      </div>
                    ) : (
                      item.button && (
                        <button className="mt-4 w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white">
                          {item.button}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mx-auto mt-8 mb-2 block text-sm text-blue-600">
          عرض الإشعارات الأقدم ⌄
        </button>
      </div>
    </div>
  );
}