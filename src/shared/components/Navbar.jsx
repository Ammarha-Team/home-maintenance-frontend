
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-panel border-b border-gray-100" dir="rtl">
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

          <a
            href="#services"
            className="cursor-pointer hover:text-blue-600 transition"
          >
            الخدمات
          </a>

          <a
            href="#about"
            className="cursor-pointer hover:text-blue-600 transition"
          >
            عن المنصة
          </a>

          <a
            href="#reviews"
            className="cursor-pointer hover:text-blue-600 transition"
          >
            آراء العملاء
          </a>

          <a
            href="#contact"
            className="cursor-pointer hover:text-blue-600 transition"
          >
            تواصل معنا
          </a>

        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">

          <ThemeToggle />

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

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-5 flex flex-col gap-4 text-gray-600">

          <Link
            to="/"
            onClick={() => setOpen(false)}
          >
            الرئيسية
          </Link>

          <a
            href="#services"
            onClick={() => setOpen(false)}
          >
            الخدمات
          </a>

          <a
            href="#about"
            onClick={() => setOpen(false)}
          >
            عن المنصة
          </a>

          <a
            href="#reviews"
            onClick={() => setOpen(false)}
          >
            آراء العملاء
          </a>

          <a
            href="#contact"
            onClick={() => setOpen(false)}
          >
            تواصل معنا
          </a>

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