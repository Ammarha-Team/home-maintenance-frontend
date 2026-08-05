import { UploadCloud } from "lucide-react";

export default function UploadImages() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        صور المشكلة (اختياري)
      </label>

      <label
        htmlFor="images"
        className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500"
      >
        <UploadCloud size={42} className="mb-3 text-blue-600" />

        <p className="font-medium text-gray-700">
          اضغط لرفع الصور
        </p>

        <p className="mt-1 text-sm text-gray-400">
          PNG • JPG • JPEG
        </p>

        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
        />
      </label>
    </div>
  );
}