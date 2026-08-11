import React from 'react';

const steps = [
  {
    number: "1",
    title: "طلب ذكي",
    desc: "حدد المشكلة، ارفع صورة للمشكلة، واكتب ملاحظاتك في نموذج الخدمة."
  },
  {
    number: "2",
    title: "اختيار الخبير",
    desc: "سنرشح لك أفضل الفنيين الأقرب بناءً على تقييمات العملاء والخبرة."
  },
  {
    number: "3",
    title: "زيارة مضمونة",
    desc: "يصل الفني في الموعد المحدد وتتم الخدمة بكل جودة واحترافية."
  },
];

const experts = [
  {
    name: "أحمد العتيبي",
    title: "أخصائي تمديدات كهربائية وأنظمة ذكية",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "محمد الشمري",
    title: "فني تكييف وتبريد صيانة منزلية",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "خالد الدوسري",
    title: "أخصائي أعمال صحية وسباكة",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80"
  },
{
    name: "سعد القحطاني",
    title: "فني صيانة عامة وأقفال ذكية",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80"
  },
];

export default function HowItWorksAndExperts() {
  return (
    <section className="bg-gray-50 py-12 px-4" dir="rtl" id="about">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        


            {/* الجانب الأيسر: كيف يعمل عقرها (يأخذ 5 أعمدة) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          
          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center justify-between">
            <span>كيف يعمل عمرها؟</span>
            <span className="text-blue-600 text-sm cursor-pointer">ⓘ</span>
          </h3>

          <div className="relative">
            {/* الخط اللي واصل بين الدوائر (مظبوط على اليمين ليتناسب مع RTL) */}
            <div className="absolute right-[15px] top-5 h-[calc(100%-40px)] w-[2px] bg-gray-100"></div>

            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="relative flex gap-5 items-start">
                  
                  {/* الرقم */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0 shadow-sm">
                    {step.number}
                  </div>

                  {/* النص */}
                  <div className="pt-1">
                    <h4 className="font-semibold text-gray-900 mb-1 text-base">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-6 max-w-md">
                      {step.desc}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>









        {/* الجانب الأيمن: فنيونا المتميزون + بانر الاستشارة (يأخذ 7 أعمدة) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* رأس القسم */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🛡️ فنيونا المتميزون
            </h3>
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
              +34 متاحون الآن
            </span>
          </div>

          {/* شبكة الفنيين */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experts.map((expert, index) => (
              <div key={index} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{expert.name}</h4>
                  <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">{expert.title}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <span>★</span>
                    <span className="text-gray-700">{expert.rating}</span>
                  </div>
                </div>
                {/* صورة الفني */}
                <img src={expert.image} alt={expert.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
              </div>
            ))}
          </div>

          {/* بانر الاستشارة الفورية */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col max-w-[70%]">
              <h4 className="text-base font-bold text-blue-900 mb-1">هل تحتاج استشارة فورية؟</h4>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">تحدث مع فريق الدعم الفني لمساعدتك في تحديد الخدمة المناسبة.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-6 rounded-xl w-fit transition-colors shadow-sm">
                طلب خدمه
              </button>
            </div>

          </div>

        </div>



      </div>
    </section>
  );
}