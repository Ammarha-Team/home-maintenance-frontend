import { UserRound, Users } from "lucide-react";
import { useState } from "react";

export default function HiringMethod() {
  const [selected, setSelected] = useState("offers");

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">
        طريقة التوظيف
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* اختيار فني معين */}
        <div
          onClick={() => setSelected("specific")}
          className={`cursor-pointer rounded-xl border p-5 transition ${
            selected === "specific"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between items-start">
            <UserRound className="text-blue-600" size={22} />
          </div>

          <h4 className="font-semibold mt-3">
            اختيار فني معين
          </h4>

          <p className="text-sm text-gray-500 mt-2">
            تصفح قائمة الفنيين المتاحين وقم بحجز موعد مع الفني الذي تفضله مباشرة.
          </p>
        </div>

        {/* استقبال عروض */}
        <div
          onClick={() => setSelected("offers")}
          className={`cursor-pointer rounded-xl border p-5 transition ${
            selected === "offers"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between items-start">
            <Users className="text-blue-600" size={22} />
          </div>

          <h4 className="font-semibold mt-3">
            استقبال عروض من الفنيين
          </h4>

          <p className="text-sm text-gray-500 mt-2">
            سيقدم الفنيون عروضهم بناءً على وصف المشكلة، ثم اختر الأنسب لك.
          </p>
        </div>

      </div>
    </div>
  );
}