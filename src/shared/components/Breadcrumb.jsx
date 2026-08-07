import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 flex-wrap">
        {/* رابط الصفحة الرئيسية الدائم */}
        <li className="flex items-center">
          <Link
            to="/home"
            className="group flex items-center gap-1.5 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:underline"
          >
            <Home size={15} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
            <span>الرئيسية</span>
          </Link>
        </li>

        {/* عرض بقية المسارات ديناميكياً */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const targetPath = item.path || item.link || "#";

          return (
            <li key={item.path || index} className="flex items-center gap-2">
              {/* فاصل اتجاه المسار */}
              <ChevronLeft size={14} className="text-gray-300 rtl:rotate-0 ltr:rotate-180 shrink-0" />

              {isLast ? (
                // العنصر الأخير (الصفحة الحالية)
                <span className="text-blue-600 font-semibold cursor-default truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                // العناصر الوسطية (روابط)
                <Link
                  to={targetPath}
                  className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:underline truncate max-w-[150px] sm:max-w-none"
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