import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="عمرها Logo"
            className="w-28"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 text-sm">

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            الرئيسية
          </Link>

          <span className="cursor-pointer hover:text-blue-600 transition">
            الخدمات
          </span>

          <span className="cursor-pointer hover:text-blue-600 transition">
            عن المنصة
          </span>

          <span className="cursor-pointer hover:text-blue-600 transition">
            تواصل معنا
          </span>

        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">

          <Link
            to="/login"
            className="
              border border-blue-500
              text-blue-600
              px-5 py-2
              rounded-lg
              text-sm
              hover:bg-blue-50
              transition
            "
          >
            تسجيل الدخول
          </Link>

          <Link
            to="/register"
            className="
              bg-blue-600
              text-white
              px-5 py-2
              rounded-lg
              text-sm
              hover:bg-blue-700
              transition
            "
          >
            إنشاء حساب
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-5 flex flex-col gap-4 text-gray-600">

          <Link
            to="/"
            onClick={() => setOpen(false)}
          >
            الرئيسية
          </Link>

          <span
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            الخدمات
          </span>

          <span
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            عن المنصة
          </span>

          <span
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            تواصل معنا
          </span>

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="
              border border-blue-500
              text-blue-600
              py-2
              rounded-lg
              text-center
            "
          >
            تسجيل الدخول
          </Link>

          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="
              bg-blue-600
              text-white
              py-2
              rounded-lg
              text-center
            "
          >
            إنشاء حساب
          </Link>

        </div>
      )}

    </nav>
  );
}