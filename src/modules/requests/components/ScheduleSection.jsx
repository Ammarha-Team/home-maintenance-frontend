import { useState } from "react";
import { Clock, MapPin } from "lucide-react";

import CustomCalendar from "./CustomCalendar";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import MapPicker from "./MapPicker";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ScheduleSection() {
  const [date, setDate] = useState(new Date());

  const position = [30.0444, 31.2357];

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