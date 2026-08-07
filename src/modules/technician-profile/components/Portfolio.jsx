import { ImagePlus, Trash2 } from "lucide-react";

const images = [
  "https://tse1.mm.bing.net/th/id/OIP.V6a1Tfw_KZyODTEjfnKZlgHaFs?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://www.goldconconstruction.ca/wp-content/uploads/2019/04/lynn-valley-North-Vancouver-Basement-Renovation-Before-After.jpg",
  "https://img.freepik.com/premium-photo/fused-cable-wiring_1077802-110648.jpg",
  "https://tse3.mm.bing.net/th/id/OIP.UHBId6pJHoawZ4Ci4rIEjQHaFK?r=0&w=1024&h=713&rs=1&pid=ImgDetMain&o=7&rm=3",
];

export default function Portfolio() {
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
      <div className="text-right">
        <h2 className="text-xl font-bold text-gray-800">
          معرض الأعمال
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          وثق أعمالك السابقة تزيد من ثقة العملاء بنسبة 40%.
        </p>
      </div>

      {/* Gallery */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={image}
            className="
              group relative
              h-[210px]
              overflow-hidden
              rounded-xl
            "
          >
            <img
              src={image}
              alt={`work-${index + 1}`}
              className="
                h-full w-full
                object-cover
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />

            {/* Delete Button */}
            <button
              type="button"
              aria-label="حذف الصورة"
              className="
                absolute left-3 top-3
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-red-500
                text-white
                opacity-0
                shadow-md
                transition-all
                duration-200
                hover:bg-red-600
                group-hover:opacity-100
              "
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {/* Upload */}
        <label
          className="
            flex h-[210px]
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            border-gray-300
            bg-gray-50
            text-center
            transition-all
            duration-200
            hover:border-blue-500
            hover:bg-gray-100
          "
        >
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-blue-50
              text-blue-500
            "
          >
            <ImagePlus size={22} />
          </div>

          <span className="mt-3 text-sm font-semibold text-gray-700">
            اسحب وأفلت الصور هنا
          </span>

          <span className="mt-1 text-xs text-gray-400">
            أو انقر للاستعراض (Max 5MB)
          </span>

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}