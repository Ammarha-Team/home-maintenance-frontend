import { useEffect, useState } from "react";
import {
  User,
  Mail,
  BriefcaseBusiness,
  Images,
  FileCheck2,
  Loader2,
} from "lucide-react";

import { useToast } from "../../../shared/toast/toastContext.js";

// The three fields on this card that the API will accept.
//
// `email` is shown but not editable — `UpdateTechnicianProfileCommand` has no
// address field, so an input the user could type into would be a promise the
// endpoint cannot keep.
const FIELDS = ["fullName", "phoneNumber", "bio"];

export default function PersonalInformation({
  profile,
  saving,
  saveError,
  fieldErrors,
  onSave,
}) {
  const { showToast } = useToast();

  const [form, setForm] = useState(() => ({
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber,
    bio: profile.bio,
  }));

  // Re-seeded when the saved record changes underneath — after a reload, or
  // once a save confirms. Keyed on the saved values only, so a keystroke never
  // triggers it.
  useEffect(() => {
    setForm({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      bio: profile.bio,
    });
  }, [profile.fullName, profile.phoneNumber, profile.bio]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  // Only what actually changed. The endpoint leaves omitted fields alone, so a
  // narrow body is also the safe one: `location` has no input on this card and
  // stays exactly as the server has it.
  const changes = FIELDS.reduce(
    (acc, field) =>
      form[field] === profile[field] ? acc : { ...acc, [field]: form[field] },
    {},
  );

  const isDirty = Object.keys(changes).length > 0;

  const handleSave = async () => {
    if (!isDirty) return;

    const saved = await onSave(changes);

    if (saved) {
      showToast({ message: "تم حفظ البيانات بنجاح.", variant: "success" });
    }
  };

  const inputClass = (field) => `
    h-[48px]
    w-full
    rounded-xl
    border ${fieldErrors[field] ? "border-[#D92D20]" : "border-[#E4E7EC]"}
    bg-[#FAFBFC]
    px-4
    text-right
    text-[14px]
    outline-none
    focus:border-[#2878E8]
    focus:bg-white
  `;

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
                value={form.fullName}
                onChange={update("fullName")}
                disabled={saving}
                className={`${inputClass("fullName")} pl-11 pr-4`}
              />

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A8]"
              />
            </div>

            {fieldErrors.fullName && (
              <p className="mt-1.5 text-right text-[12px] text-[#D92D20]">
                {fieldErrors.fullName}
              </p>
            )}
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
                value={form.phoneNumber}
                onChange={update("phoneNumber")}
                disabled={saving}
                className={`${inputClass("phoneNumber")} pl-[90px]`}
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

            {fieldErrors.phoneNumber && (
              <p className="mt-1.5 text-right text-[12px] text-[#D92D20]">
                {fieldErrors.phoneNumber}
              </p>
            )}
          </div>

        </div>



        {/* البريد — للعرض فقط، لا يقبله الـ API للتعديل */}
        <div className="mt-6">

          <label className="mb-2.5 block text-right text-[14px] font-semibold text-[#444]">
            البريد الإلكتروني
          </label>

          <div className="relative">

            <input
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              value={profile.email}
              readOnly
              className="
                h-[48px]
                w-full
                cursor-not-allowed
                rounded-xl
                border border-[#E4E7EC]
                bg-[#F2F4F7]
                px-4
                pl-11
                text-right
                text-[14px]
                text-[#667085]
                outline-none
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
            value={form.bio}
            onChange={update("bio")}
            disabled={saving}
            className={`
              min-h-[115px]
              w-full
              resize-none
              rounded-xl
              border ${fieldErrors.bio ? "border-[#D92D20]" : "border-[#E4E7EC]"}
              bg-[#FAFBFC]
              px-4
              py-3
              text-right
              text-[14px]
              outline-none
              focus:border-[#2878E8]
              focus:bg-white
            `}
          />

          {fieldErrors.bio && (
            <p className="mt-1.5 text-right text-[12px] text-[#D92D20]">
              {fieldErrors.bio}
            </p>
          )}

        </div>


        {saveError && (
          <p className="mt-4 text-right text-[13px] font-semibold text-[#B42318]">
            {saveError}
          </p>
        )}


<div className="mt-4 flex justify-start">
  <button
    type="button"
    onClick={handleSave}
    disabled={saving || !isDirty}
    className="
      flex
      cursor-pointer
      items-center
      gap-2
      rounded-xl
      bg-[#2878E8]
      px-8
      py-3
      text-[14px]
      font-semibold
      text-white
      hover:bg-[#1769D5]
      disabled:cursor-not-allowed
      disabled:opacity-60
    "
  >
    {saving && <Loader2 size={16} className="animate-spin" />}
    {saving ? "جارٍ الحفظ..." : "حفظ البيانات"}
  </button>
</div>

      </div>

    </section>
  );
}
