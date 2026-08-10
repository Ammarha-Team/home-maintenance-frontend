import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, User, Settings, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";
import NotificationModal from "../../shared/components/NotificationModal";
import ThemeToggle from "./ThemeToggle.jsx";
import { AUTH_ROUTES } from "../../modules/auth/constants/authRoutes.js";
import { signOut } from "../../modules/auth/services/authService.js";

export default function UserNavbar({ onRequestClick }) {
  const [open, setOpen] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const userAvatar = null; 

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Signing out revokes the refresh token server side and clears the stored
  // session. This previously only navigated away, which left the account signed
  // in — the next visit to a protected screen walked straight back in.
  const handleLogout = async () => {
    await signOut();
    navigate(AUTH_ROUTES.login, { replace: true });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* 1. اللوجو على اليمين */}
        <Link to="/home">
          <img src={logo} alt="عمرها Logo" className="w-28 object-contain" />
        </Link>

        {/* 2. روابط التنقل الوسطية (سطح المكتب) */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/home"
            className={`relative py-1 transition-colors ${
              isActive("/home") ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            الرئيسية
            {isActive("/home") && (
              <span className="absolute bottom-[-13px] right-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/request-service"
            className={`transition-colors ${
              isActive("/request-service") ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            طلب خدمة
          </Link>

          <Link
            to="/my-orders"
            className={`relative py-1 transition-colors ${
              isActive("/my-orders") || isActive("/orders") ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            طلباتي
            {(isActive("/my-orders") || isActive("/orders")) && (
              <span className="absolute bottom-[-13px] right-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/messages"
            className={`relative py-1 transition-colors ${
              isActive("/messages") ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            الرسائل
            {isActive("/messages") && (
              <span className="absolute bottom-[-13px] right-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
            )}
          </Link>
        </div>

        {/* 3. الإشعارات، الفاصل، وبروفايل المستخدم على اليسار */}
        <div className="hidden md:flex items-center gap-4">
          {/* Beside the bell rather than inside the account menu: it is a
              display setting, not an account one, and the two round controls
              read as a pair at this end of the bar. */}
          <ThemeToggle />

           <button
  onClick={() => setShowNotifications(true)}
  className="relative w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-600 hover:bg-blue-100/55 transition"
>
  <Bell size={20} />
  <span className="absolute top-2 left-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
</button>

          <div className="h-6 w-[1px] bg-blue-200"></div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="صورة المستخدم" className="w-10 h-10 rounded-full object-cover border border-gray-200 hover:ring-2 hover:ring-blue-400 transition" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 hover:ring-2 hover:ring-blue-400 transition">
                  <User size={20} className="text-gray-500" />
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 text-sm">
                <Link
                  to="/technician/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <User size={16} />
                  <span>الملف الشخصي</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Settings size={16} />
                  <span>الإعدادات</span>
                </Link>

                <div className="h-[1px] bg-gray-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition text-right"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Beside the burger rather than inside the sheet it opens: a setting
            that changes the whole page should not be reachable only after
            opening a menu. */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle compact />

          <button
            className="text-blue-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {open && (
        <div className="md:hidden px-6 pb-5 pt-3 flex flex-col gap-4 text-gray-700 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
            <Link to="/technician/profile" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={18} className="text-gray-500" />
              </div>
              <span className="font-bold text-sm text-gray-900">حسابي الشخصي</span>
            </Link>
            <div className="relative cursor-pointer w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Bell size={18} />
              <span className="absolute top-2 left-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
          </div>

          <Link to="/home" onClick={() => setOpen(false)} className="hover:text-blue-600">الرئيسية</Link>
          <button
  onClick={() => {
    setOpen(false);
    onRequestClick();
  }}
  className="text-right hover:text-blue-600"
>
  طلب خدمة
</button>
          <Link to="/my-orders" onClick={() => setOpen(false)} className="hover:text-blue-600">طلباتي</Link>
          <Link to="/messages" onClick={() => setOpen(false)} className="hover:text-blue-600">الرسائل</Link>
          <Link to="/settings" onClick={() => setOpen(false)} className="hover:text-blue-600">الإعدادات</Link>

          <div className="h-[1px] bg-gray-100 my-1"></div>

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 text-red-600 font-medium pb-2 text-right"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}

      <NotificationModal
  open={showNotifications}
  onClose={() => setShowNotifications(false)}
/>
    </nav>
  );
}