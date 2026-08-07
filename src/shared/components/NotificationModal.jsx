import { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  CheckCircle,
  MapPin,
  Star,
  Wrench,
} from "lucide-react";

export default function NotificationModal({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock Data مؤقتًا لحد ما الـ API يجهز
    setNotifications([
      {
        id: 1,
        type: "offer",
        title: "عرض جديد من فني صيانة",
        message:
          "لقد تلقيت عرضًا جديدًا من الفني أحمد محمود لإصلاح الغسالة، يمكنك مراجعة السعر والتفاصيل.",
        time: "منذ 10 دقائق",
        action: "عرض تفاصيل الطلب",
        read: false,
      },
      {
        id: 2,
        type: "tracking",
        title: "تحديث حالة الطلب",
        message:
          "الفني في طريقه إليك الآن، الوقت المتوقع للوصول خلال 30 دقيقة.",
        time: "منذ ساعة",
        action: "متابعة على الخريطة",
        read: false,
      },
      {
        id: 3,
        type: "completed",
        title: "اكتمل الطلب بنجاح",
        message:
          "تم إنهاء الطلب بنجاح، يمكنك الآن تقييم الخدمة ومشاركة رأيك.",
        time: "منذ يوم",
        action: "تقييم الخدمة",
        read: true,
      },
    ]);
  }, []);

  if (!open) return null;

  const getIcon = (type) => {
    switch (type) {
      case "offer":
        return <Wrench className="text-blue-600" size={22} />;

      case "tracking":
        return <MapPin className="text-orange-500" size={22} />;

      case "completed":
        return <CheckCircle className="text-green-500" size={22} />;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-8">
      <div className="w-[390px] h-[85vh] bg-[#F8F6F2] rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b px-5 py-4 flex items-center justify-between">

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-bold">
            الإشعارات
          </h2>

          <div className="w-8"></div>

        </div>

        {/* Body */}
        <div className="h-full overflow-y-auto px-4 py-4">

          <div className="text-center">

            <h3 className="font-bold text-gray-800">
              مركز الإشعارات والتنبيهات
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              أحدث الإشعارات مع متابعة مستمرة لطلباتك
            </p>

          </div>

          <div className="flex justify-start mt-5 mb-4">

            <button className="bg-white border rounded-lg px-3 py-2 text-xs flex items-center gap-2 shadow-sm">
              تحديد الكل كمقروء
              <ChevronDown size={14} />
            </button>

          </div>

          <div className="space-y-4">

            {notifications.map((item) => {

              const offer = item.type === "offer";

              return (

                <div
                  key={item.id}
                  className={`rounded-xl p-4 border transition ${
                    offer
                      ? "bg-[#EEF5FF] border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >

                  <div className="flex gap-3">

                    <div className="mt-1">

                      {offer ? (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
  <Wrench className="text-blue-600" size={20} />
</div>
                      ) : (
                        getIcon(item.type)
                      )}

                    </div>

                    <div className="flex-1">

                      <span className="text-xs text-gray-400">
                        {item.time}
                      </span>

                      <h3
                        className={`font-bold mt-1 ${
                          offer
                            ? "text-blue-600"
                            : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-6 mt-2">
                        {item.message}
                      </p>
                                            {item.type === "completed" ? (
                        <>
                          <div className="flex items-center gap-1 text-yellow-500 mt-3">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                size={15}
                                fill={index < 4 ? "currentColor" : "none"}
                              />
                            ))}
                          </div>

                          <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                            {item.action}
                          </button>
                        </>
                      ) : (
                        <button className="w-full mt-4 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 transition">
                          {item.action}
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

          <div className="py-6 text-center">
            <button className="text-sm font-medium text-blue-600 hover:underline">
              عرض المزيد من الإشعارات
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}