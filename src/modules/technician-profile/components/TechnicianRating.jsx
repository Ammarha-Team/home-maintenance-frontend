import {
  Award,
  BadgeCheck,
  FileText,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";

const certificates = [
  {
    id: 1,
    title: "شهادة تدريبية في صيانة تكييفات السيارات.pdf",
    status: "تم التحقق",
  },
];

export default function Certificates() {
  return (
    <div
      dir="rtl"
      className="
        w-full max-w-[995px]
        mr-0 ml-auto
        rounded-2xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        mb-10 mt-10
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          الشهادات والتراخيص المهنية
        </h2>

        <button
          type="button"
          className="
            flex h-8 w-8
            items-center justify-center
            rounded-lg
            text-blue-700
            transition
            hover:bg-blue-50
          "
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Divider */}
      <div className="mt-5 border-t border-gray-200 pt-5">

        {/* Upload Options */}
        <div className="mx-auto grid w-full max-w-[630px] grid-cols-2 gap-3">

          {/* رخصة مزاولة المهنة */}
          <label
            className="
              flex h-[112px] w-full
              cursor-pointer
              flex-col items-center justify-center
              rounded-xl
              border-2 border-dashed border-gray-300
              bg-white
              px-2
              text-center
              transition
              hover:border-blue-400
              hover:bg-blue-50/30
            "
          >
            <div className="mb-1.5 flex items-center justify-center text-gray-500">
              <BadgeCheck size={23} strokeWidth={1.7} />
            </div>

            <span className="text-[12px] font-semibold leading-5 text-gray-700">
              رخصة مزاولة المهنة
            </span>

            <span className="mt-0.5 text-[10px] leading-4 text-gray-400">
              ارفع رخصة مزاولة المهنة
            </span>

            <span className="text-[9px] leading-4 text-gray-400">
              PDF, JPG, PNG (Max 5MB)
            </span>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
          </label>

          {/* شهادات مهنية تدريبية */}
          <label
            className="
              flex h-[112px] w-full
              cursor-pointer
              flex-col items-center justify-center
              rounded-xl
              border-2 border-dashed border-gray-300
              bg-white
              px-2
              text-center
              transition
              hover:border-blue-400
              hover:bg-blue-50/30
            "
          >
            <div className="mb-1.5 flex items-center justify-center text-gray-500">
              <Award size={23} strokeWidth={1.7} />
            </div>

            <span className="text-[12px] font-semibold leading-5 text-gray-700">
              شهادات مهنية تدريبية
            </span>

            <span className="mt-0.5 text-[10px] leading-4 text-gray-400">
              ارفع الشهادة أو سجلها في ملفك
            </span>

            <span className="text-[9px] leading-4 text-gray-400">
              PDF, JPG, PNG (Max 5MB)
            </span>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
          </label>
        </div>

        {/* Uploaded Certificate */}
        <div className="mx-auto mt-3 w-full max-w-[630px]">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="
                flex min-h-[52px]
                items-center justify-between
                rounded-lg
                border border-gray-200
                bg-white
                px-2.5 py-2
              "
            >
              {/* File Info */}
              <div className="flex min-w-0 items-center gap-2">

                {/* File Icon */}
                <div
                  className="
                    flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-500
                  "
                >
                  <FileText size={18} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-gray-700">
                    {certificate.title}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-green-500">
                    {certificate.status}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">

                {/* Delete */}
                <button
                  type="button"
                  className="
                    text-gray-400
                    transition
                    hover:text-red-500
                  "
                  title="حذف"
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </button>

                {/* View */}
                <button
                  type="button"
                  className="
                    text-gray-400
                    transition
                    hover:text-blue-500
                  "
                  title="عرض"
                >
                  <Eye size={17} strokeWidth={1.8} />
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}