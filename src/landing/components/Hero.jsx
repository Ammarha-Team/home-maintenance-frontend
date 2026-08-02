export default function Hero() {
  return (
    <section dir="rtl" className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div
            className="
            inline-flex
            items-center
            gap-2
            bg-blue-50
            text-blue-600
            px-5
            py-2
            rounded-full
            text-sm
            mb-6
            border border-blue-100
          "
          >
            <span className="text-lg">🛠️</span>
            صيانة منزلية بمقاييس عالمية
          </div>
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            صيانة منزلك أصبحت أذكى وأسهل مع{" "}
            <span className="text-blue-600 font-semibold">عمّرها</span>
          </h1>

          <p
            className="
            text-gray-500
            mt-6
            text-lg
            leading-8
            max-w-xl
          "
          >
            احجز أفضل الفنيين المعتمدين لخدمات التكييف، الأجهزة الكهربائية،
            والسباكة بضغطة زر واحدة.. جودة نضمنها لك.
          </p>

          <div className="flex gap-4 mt-10">
            <button
              className="
              bg-blue-600
              text-white
              px-8
              py-3
              rounded-xl
              font-semibold
              hover:bg-blue-700
              transition-colors
            "
            >
              طلب خدمة
            </button>

            <button
              className="
              bg-white
              text-gray-700
              border
              border-gray-300
              px-8
              py-3
              rounded-xl
              font-semibold
              hover:bg-gray-50
              transition-colors
            "
            >
              استكشف خدماتنا
            </button>
          </div>
        </div>

        {/* Image & 3 Cards */}
        <div className="relative flex justify-center items-center">
          {/* الصورة الرئيسية */}
          <img
            src="https://img.freepik.com/premium-photo/hvac-technician-hd-stock-images_1012565-36673.jpg"
            alt="فني صيانة محترف"
            className="
              w-[450px]
              h-[450px]
              object-cover
              rounded-3xl
              shadow-2xl
            "
          />

          {/* المربع الأول: أعلى اليسار */}
          <div
            className="
            absolute
            top-6
            -left-10
            bg-white/95
            backdrop-blur-sm
            shadow-xl
            rounded-2xl
            px-3.5
            py-2.5
            flex
            items-center
            gap-3
            text-xs
            border
            border-white/50
            z-10
          "
          >
            <div className="bg-amber-400 text-white p-2 rounded-xl text-sm">
              ⭐
            </div>
            <div>
              <div className="font-bold text-gray-900">فنيون معتمدون</div>
              <div className="text-gray-500 text-[10px]">جودة مضمونة 100%</div>
            </div>
          </div>

          {/* المربع الثاني: في المنتصف على اليمين */}
          <div
            className="
            absolute
            top-1/2
            -right-10
            -translate-y-1/2
            bg-white/95
            backdrop-blur-sm
            shadow-xl
            rounded-2xl
            px-3.5
            py-2.5
            flex
            items-center
            gap-3
            text-xs
            border
            border-white/50
            z-10
          "
          >
            <div className="bg-blue-600 text-white p-2 rounded-xl text-sm">
              ⚡
            </div>
            <div>
              <div className="font-bold text-gray-900">سرعة الحجز</div>
              <div className="text-gray-500 text-[10px]">خلال دقائق معدودة</div>
            </div>
          </div>

          {/* المربع الثالث: أسفل اليسار */}
          <div
            className="
            absolute
            -bottom-6
            left-8
            bg-white/95
            backdrop-blur-sm
            shadow-xl
            rounded-2xl
            px-3.5
            py-2.5
            flex
            items-center
            gap-3
            text-xs
            border
            border-white/50
            z-10
          "
          >
            <div className="bg-emerald-500 text-white p-2 rounded-xl text-sm">
              🛡️
            </div>
            <div>
              <div className="font-bold text-gray-900">فنيون متميزون</div>
              <div className="text-gray-500 text-[10px]">أكثر من 500 خبير</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}