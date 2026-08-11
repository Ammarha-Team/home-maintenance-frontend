import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AUTH_ROUTES } from "../../modules/auth/constants/authRoutes.js";
import logo from "../../assets/logo.png";
import ThemeToggle from "./ThemeToggle.jsx";

// The three links beside the home link. Each points at a page that already
// exists in AppRoutes; "تواصل معنا" is the help and support screen, which is
// where the contact details live — there is no separate /contact route.
//
// "الخدمات" opens the login screen instead of the services page: browsing the
// catalogue is for people with an account. It keeps its own address so the
// link is still a link — one that can be opened in a new tab, and one that
// says where it would go — and the click is what redirects.
const NAV_LINKS = [
  { to: "/services", label: "الخدمات", signInFirst: true },
  { to: "/about", label: "عن المنصة" },
  { to: "/help-support", label: "تواصل معنا" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const followLink = (link) => (event) => {
    setOpen(false);

    if (link.signInFirst) {
      event.preventDefault();
      navigate(AUTH_ROUTES.login);
    }
  };

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

          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={followLink(link)}
              className="hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}

        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">

          {/* First in the markup, so under RTL it sits at the right of the
              pair of buttons and does not come between them. */}
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

          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={followLink(link)}
            >
              {link.label}
            </Link>
          ))}

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
