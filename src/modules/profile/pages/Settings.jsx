import {
  Lock,
  Bell,
  Globe,
  MapPin,
  CircleHelp,
  ShieldCheck,
  FileText,
  Info,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "../../auth/constants/authRoutes.js";
import { signOut } from "../../auth/services/authService.js";

export default function Settings() {
  const navigate = useNavigate();

  const settingsItems = [
    {
      icon: <Lock size={20} />,
      title: "تغيير كلمة المرور",
      subtitle: "تغيير كلمة مرور حسابك",
      path: "/change-password",
    },
    {
      icon: <Bell size={20} />,
      title: "الإشعارات",
      subtitle: "إدارة إشعارات التطبيق",
      path: "/notifications",
    },
    {
      icon: <Globe size={20} />,
      title: "اللغة",
      subtitle: "العربية",
      path: "/language",
    },
    {
      icon: <MapPin size={20} />,
      title: "العناوين المحفوظة",
      subtitle: "إدارة العناوين",
      path: "/savedaddresses",
    },
    {
      icon: <CircleHelp size={20} />,
      title: "المساعدة والدعم",
      subtitle: "تواصل معنا",
      path: "/help-support",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "سياسة الخصوصية",
      subtitle: "تعرف على كيفية حماية بياناتك",
      path: "/privacy-policy",
    },
    {
      icon: <FileText size={20} />,
      title: "الشروط والأحكام",
      subtitle: "اقرأ شروط استخدام التطبيق",
      path: "/terms",
    },
    {
      icon: <Info size={20} />,
      title: "عن التطبيق",
      subtitle: "معلومات عن تطبيق عمرها",
      path: "/about",
    },
  ];

  // Signing out revokes the refresh token server side and clears the stored
  // session. This previously only navigated away, which left the account signed
  // in — the next visit to a protected screen walked straight back in.
  const handleLogout = async () => {
    await signOut();
    navigate(AUTH_ROUTES.login, { replace: true });
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-10 px-4"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          الإعدادات
        </h1>

        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">

          {settingsItems.map((item, index) => (
            <button
  key={index}
  onClick={() => navigate(item.path)}
  className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition border-b last:border-b-0"
>
  {/* يمين: الأيقونة + النص */}
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
      {item.icon}
    </div>

    <div className="text-right flex-1">
      <h2 className="font-semibold text-gray-800">
        {item.title}
      </h2>

      <p className="text-sm text-gray-500">
        {item.subtitle}
      </p>
    </div>
  </div>

  {/* شمال: السهم */}
  <ChevronLeft
    size={20}
    className="text-gray-400 flex-shrink-0"
  />
</button>
          ))}

        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-50 border border-red-200 text-red-600 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>

      </div>
    </div>
  );
}