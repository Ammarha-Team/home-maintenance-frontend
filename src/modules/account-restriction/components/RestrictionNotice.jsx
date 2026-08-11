import { Info } from "lucide-react";

export default function RestrictionNotice() {
  return (
    <div className="mt-10 flex items-center gap-3 rounded-lg bg-gray-200 p-5 text-sm text-gray-500" dir="rtl">
      <Info size={25} />
      بمجرد إتمام عملية الدفع سيتم تفعيل حسابك فورًا وبشكل تلقائي للبدء في استقبال الطلبات مرة أخرى.
    </div>
  );
}