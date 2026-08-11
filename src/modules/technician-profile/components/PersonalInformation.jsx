import {
  User,
  Mail,
  BriefcaseBusiness,
  Images,
  FileCheck2,
} from "lucide-react";

export default function PersonalInformation() {
  return (
    <section
      className="
        flex
        w-full
        flex-col
        gap-6
        md:flex-row-reverse
        items-start
      "
      dir="rtl"
    >


      <aside
        className="
          hidden
          w-[210px]
          shrink-0
          rounded-2xl
          border
          border-[#E6EAF0]
          bg-white
          p-3
          shadow-sm
          md:block
        "
      >

        <button
          className="
            flex
            w-full
            items-center
            gap-2
            rounded-xl
            bg-[#EAF2FF]
            px-4
            py-3
            text-right
            text-[14px]
            font-semibold
            text-[#2878E8]
          "
        >
          <User size={18}/>
          البيانات الشخصية
        </button>


        <button className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-[14px] text-[#666] hover:bg-[#F7F9FC]">
          <BriefcaseBusiness size={18}/>
          الخبرة والتخصص
        </button>


        <button className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-[14px] text-[#666] hover:bg-[#F7F9FC]">
          <Images size={18}/>
          معرض الأعمال
        </button>


        <button className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-[14px] text-[#666] hover:bg-[#F7F9FC]">
          <FileCheck2 size={18}/>
          الشهادات والتراخيص المهنية
        </button>


      </aside>

      <div
        className="
          min-w-0
          flex-1
          rounded-2xl
          border
          border-[#E6EAF0]
          bg-white
          p-6
          shadow-sm
          md:p-7
        "
      >

        {/* العنوان */}
        <div className="border-b border-[#EEF0F3] pb-5">
          <h2 className="text-right text-[20px] font-bold text-[#333333]">
            البيانات الشخصية والمهنية
          </h2>
        </div>


        {/* الاسم + الهاتف */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* الاسم */}
          <div>
            <label className="mb-2.5 block text-right text-[14px] font-semibold text-[#444]">
              الاسم الكامل
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="أدخل الاسم الكامل"
                className="
                  h-[48px]
                  w-full
                  rounded-xl
                  border border-[#E4E7EC]
                  bg-[#FAFBFC]
                  px-4
                  pr-4
                  pl-11
                  text-right
                  text-[14px]
                  outline-none
                  focus:border-[#2878E8]
                  focus:bg-white
                "
              />

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A8]"
              />
            </div>
          </div>


          {/* الهاتف */}
          <div>
            <label className="mb-2.5 block text-right text-[14px] font-semibold text-[#444]">
              رقم الهاتف
            </label>

            <div className="relative">

              <input
                type="tel"
                placeholder="أدخل رقم الهاتف"
                dir="ltr"
                className="
                  h-[48px]
                  w-full
                  rounded-xl
                  border border-[#E4E7EC]
                  bg-[#FAFBFC]
                  px-4
                  pl-[90px]
                  text-right
                  text-[14px]
                  outline-none
                  focus:border-[#2878E8]
                  focus:bg-white
                "
              />


              <div
                dir="ltr"
                className="
                  absolute
                  left-3
                  top-1/2
                  flex
                  -translate-y-1/2
                  items-center
                  gap-2
                  border-r
                  border-[#E1E4E8]
                  pr-2
                  text-[13px]
                  text-[#555]
                "
              >
                <span className="text-lg">🇪🇬</span>
                <span>+20</span>
              </div>

            </div>
          </div>

        </div>



        {/* البريد */}
        <div className="mt-6">

          <label className="mb-2.5 block text-right text-[14px] font-semibold text-[#444]">
            البريد الإلكتروني
          </label>

          <div className="relative">

            <input
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              className="
                h-[48px]
                w-full
                rounded-xl
                border border-[#E4E7EC]
                bg-[#FAFBFC]
                px-4
                pl-11
                text-right
                text-[14px]
                outline-none
                focus:border-[#2878E8]
                focus:bg-white
              "
            />

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A8]"
            />

          </div>

        </div>



        {/* النبذة */}
        <div className="mt-6">

          <label className="mb-2.5 block text-right text-[14px] font-semibold text-[#444]">
            نبذة تعريفية (تظهر للعملاء)
          </label>


          <textarea
            rows={4}
            placeholder="اكتب نبذة تعريفية عن خبرتك وتخصصك..."
            className="
              min-h-[115px]
              w-full
              resize-none
              rounded-xl
              border border-[#E4E7EC]
              bg-[#FAFBFC]
              px-4
              py-3
              text-right
              text-[14px]
              outline-none
              focus:border-[#2878E8]
              focus:bg-white
            "
          />

        </div>


<div className="mt-4 flex justify-start">
  <button
    type="button"
    onClick={() => console.log("clicked")}
    className="
      cursor-pointer
      rounded-xl
      bg-[#2878E8]
      px-8
      py-3
      text-[14px]
      font-semibold
      text-white
      hover:bg-[#1769D5]
    "
  >
    حفظ البيانات
  </button>
</div>

      </div>

    </section>
  );
}