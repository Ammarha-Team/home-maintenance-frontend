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
        <div>
          <img
            src={logo}
            alt="عمرها Logo"
            className="w-28"
          />
        </div>


        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 text-sm">

          <Link className="text-blue-600 font-semibold">
            الرئيسية
          </Link>

          <Link>
            الخدمات
          </Link>

          <Link>
            عن المنصة
          </Link>

          <Link>
            تواصل معنا
          </Link>

        </div>


        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">

          <button className="border border-blue-500 text-blue-600 px-5 py-2 rounded-lg text-sm">
            تسجيل الدخول
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">
            إنشاء حساب
          </button>

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

          <Link>
            الرئيسية
          </Link>

          <Link>
            الخدمات
          </Link>

          <Link>
            عن المنصة
          </Link>

          <Link>
            تواصل معنا
          </Link>


          <button className="border border-blue-500 text-blue-600 py-2 rounded-lg">
            تسجيل الدخول
          </button>

          <button className="bg-blue-600 text-white py-2 rounded-lg">
            إنشاء حساب
          </button>

        </div>
      )}

    </nav>
  );
}