export default function OurTechnicians() {
  return (
    <section dir="rtl" className="bg-gray-50 py-16 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* الكارت الأساسي */}
        <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 md:p-12 flex flex-col items-start text-right">
          
          {/* العنوان الرئيسي */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            فنيونا هم سر نجاحنا
          </h2>

          {/* الوصف التعريفي */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-3xl mb-8">
            نحن لا نوقف أي شخص فحسب، كل فني في "عمّرها" يخضع لتدريب مكثف واختبارات فنية دقيقة لضمان تقديمه لأفضل خدمة ممكنة.
          </p>

          {/* قائمة المميزات (محاذاة تامة لليمين) */}
          <ul className="flex flex-col gap-4 mb-10 w-full items-start">
            <li className="flex items-center gap-3 text-gray-700 text-sm md:text-base">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>فحص السيرة الذاتية والسجل الجنائي</span>
            </li>

            <li className="flex items-center gap-3 text-gray-700 text-sm md:text-base">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>اختبارات مهارية فنية دورية</span>
            </li>

            <li className="flex items-center gap-3 text-gray-700 text-sm md:text-base">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>تقييم مستمر من قبل العملاء الحقيقيين</span>
            </li>
          </ul>

          {/* زر انضم كفني محترف (في منتصف الكارت) */}
          <div className="w-full flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-colors duration-200 text-sm md:text-base">
              انضم كفني محترف
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}