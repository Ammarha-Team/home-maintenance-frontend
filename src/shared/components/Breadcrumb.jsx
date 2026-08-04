import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumbs" className="mb-6">
      <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 flex-wrap">
        {/* رابط الصفحة الرئيسية الدائم */}
        <li className="flex items-center">
          <Link
            to="/home"
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:underline"
          >
            <Home size={15} className="text-gray-400 group-hover:text-blue-600" />
            <span>الرئيسية</span>
          </Link>
        </li>

        {/* عرض بقية المسارات ديناميكياً */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* فاصل اتجاه المسار باستخدام أيقونة Lucide */}
              <ChevronLeft size={14} className="text-gray-300 rtl:rotate-0 ltr:rotate-180" />

              {isLast ? (
                // العنصر الأخير (الصفحة الحالية) يكون بدون Link ولون مميز
                <span className="text-blue-600 font-semibold cursor-default" aria-current="page">
                  {item.label}
                </span>
              ) : (
                // العناصر الوسطية تكون روابط
                <Link
                  to={item.path}
                  className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}