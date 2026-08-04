import {
  CircleHelp,
  Phone,
  Mail,
  MessageCircle,
  Clock,
} from "lucide-react";

export default function HelpSupport() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6" dir="rtl">

      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        المساعدة والدعم
      </h1>

      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">

        <Item
          icon={<CircleHelp />}
          title="الأسئلة الشائعة"
          subtitle="اعثر على إجابات للأسئلة الأكثر شيوعًا."
        />

        <Item
          icon={<Phone />}
          title="اتصل بنا"
          subtitle="01012345678"
        />

        <Item
          icon={<Mail />}
          title="البريد الإلكتروني"
          subtitle="support@ammarha.com"
        />

        <Item
          icon={<MessageCircle />}
          title="واتساب"
          subtitle="تواصل مع فريق الدعم"
        />

        <Item
          icon={<Clock />}
          title="ساعات العمل"
          subtitle="السبت - الخميس | 9:00 ص - 9:00 م"
        />

      </div>

      <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
        تواصل مع الدعم
      </button>

    </div>
  );
}

function Item({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 p-5 border-b last:border-b-0">

      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-800">
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

    </div>
  );
}