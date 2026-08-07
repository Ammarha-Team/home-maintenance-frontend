import { Lock } from "lucide-react";

export default function RestrictionHeader() {
  return (
    <div className="text-center mb-10">

      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#C71F1F] shadow-lg rotate-[-6deg]">
        <Lock className="text-white" size={40} />
      </div>

      <h1 className="mt-8 text-3xl font-bold text-[#C71F1F]">
        تنبيه: حسابك مقيد مؤقتًا
      </h1>

      <p className="mt-4 text-gray-500 leading-8">
        لقد تجاوزت الحد المسموح به للمديونية، تم تعليق استقبال
        الطلبات الجديدة حتى يتم تسوية المبلغ المستحق.
      </p>

    </div>
  );
}