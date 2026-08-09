import { X } from "lucide-react";
import { useState } from "react";

export default function ExperienceInformation() {
  const [skills, setSkills] = useState([
    "تمديدات ذكية",
    "لوحات توزيع",
    "أنظمة الإنذار",
  ]);

  const [selectedLevel, setSelectedLevel] = useState("متوسط");

  const services = [
    "تكييف",
    "أجهزة منزلية",
    "ثلاجات",
    "غسالات",
    "تسخين",
    "سباكة",
    "كهرباء",
    "تركيب أجهزة",
    "كاميرات مراقبة",
  ];

  return (
    <div
      dir="rtl"
      className="w-full max-w-[995px] mr-0 ml-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-10 mt-10"
    >
      {/* Title */}
      <h2 className="mb-5 text-right text-xl font-bold text-gray-800">
        الخبرة والتخصص
      </h2>

      <div className="border-t border-gray-200 pt-5">
        {/* Main specialization */}
        <label className="mb-2 block text-right text-sm font-medium text-gray-500">
          التخصص الرئيسي
        </label>

        <select
          className="
            mb-5 w-full rounded-xl border border-gray-200
            bg-white px-4 py-3 text-right text-sm text-gray-700
            outline-none transition
            focus:border-blue-500
          "
        >
          <option>سباكة</option>
          <option>كهرباء</option>
          <option>تكييف</option>
        </select>

        {/* Experience + Level */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Experience years */}
          <div>
            <label className="mb-2 block text-right text-sm font-medium text-gray-500">
              سنوات الخبرة
            </label>

            <input
              type="number"
              defaultValue="8"
              className="
                w-full rounded-xl border border-gray-200
                bg-white px-4 py-3 text-right text-sm
                outline-none transition
                focus:border-blue-500
              "
            />
          </div>

          {/* Level */}
          <div>
            <label className="mb-2 block text-right text-sm font-medium text-gray-500">
              مستوى الخبرة
            </label>

            <div className="flex overflow-hidden rounded-xl border border-gray-200">
              {["مبتدئ", "متوسط", "خبير"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedLevel(item)}
                  className={`
                    flex-1 py-2 text-sm transition
                    ${
                      selectedLevel === item
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-5">
          <label className="mb-3 block text-right text-sm font-medium text-gray-500">
            المهارات التقنية (مفصولة بفاصلة)
          </label>

          <div className="mb-3 flex flex-wrap justify-start gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="
                  flex items-center gap-1
                  rounded-full border border-blue-200
                  bg-blue-50 px-3 py-1
                  text-xs text-blue-600
                "
              >
                {skill}

                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() =>
                    setSkills((prevSkills) =>
                      prevSkills.filter((item) => item !== skill)
                    )
                  }
                />
              </span>
            ))}
          </div>

          <input
            placeholder="أضف مهارة جديدة"
            className="
              w-full rounded-xl border border-gray-200
              bg-white px-4 py-3 text-right text-sm
              outline-none transition
              focus:border-blue-500
            "
          />
        </div>

        {/* Services */}
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {services.map((service) => (
              <label
                key={service}
                className="
                  flex cursor-pointer items-center gap-2
                  rounded-lg border border-gray-200
                  bg-gray-50 px-3 py-2
                  text-right text-sm text-gray-600
                  transition hover:bg-gray-100
                "
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-500"
                />

                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}