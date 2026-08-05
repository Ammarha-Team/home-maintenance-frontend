import { Clock } from "lucide-react";

import CustomCalendar from "./CustomCalendar";

// The map, its tile layer and the Leaflet default-marker fix all live in
// ServiceMap now, which MapPicker renders — nothing map-related is needed here.
import MapPicker from "./MapPicker";

export default function ScheduleSection() {
  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="text-right">
        <h3 className="text-lg font-bold text-gray-800">
          اختر التاريخ والوقت
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          برجاء تحديد الموعد المناسب لزيارة الفني
        </p>
      </div>

      {/* الوقت */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">
          الوقت
        </label>

        <div className="relative">
          <Clock
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-11 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>9:00</option>
            <option>10:00</option>
            <option>11:00</option>
            <option>12:00</option>
            <option>1:00</option>
            <option>2:00</option>
          </select>
        </div>
      </div>

      {/* الخريطة + الكالندر */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الخريطة */}

        <MapPicker />

        {/* الكالندر */}
         <CustomCalendar />
      </div>
    </div>
  );
}