import { Calendar, AlertCircle, Ban } from "lucide-react";

export default function OutstandingCard() {
  return (
    <div className="rounded-xl border bg-white shadow-sm" dir="rtl">

      <div className="flex items-center justify-between border-b p-5">

        <span className="font-medium text-gray-500">
          إجمالي المبلغ المستحق
        </span>

        <span className="text-xl font-bold text-red-600">
          450.00 ج.م
        </span>

      </div>

      <div className="space-y-5 p-5">

        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-red-500" />
          <div>
            <p>آخر تاريخ للاستحقاق</p>
            <p className="font-medium text-sm text-gray-400">23/5/2025</p>
          </div>
        </div>


        <div className="flex items-center gap-3">
          <Ban size={18} className="text-gray-500" />
          <div>
            <p>القيود الحالية </p>
            <p className="text-sm text-gray-400">لا يمكن استقبال طلبات جديدة</p>
          </div>
        </div>

      </div>

    </div>
  );
}