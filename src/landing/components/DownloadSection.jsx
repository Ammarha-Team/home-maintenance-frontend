export default function DownloadAppSection() {
  return (
    <section dir="rtl" className="py-15">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#DCEBFF] px-8 lg:px-14 py-12">

          {/* الخلفية */}
          <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-[#BFD6FF] opacity-60"></div>
          <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#BFD6FF] opacity-60"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-16">

            {/* النص والمحتوى */}
            <div className="order-2 lg:order-1 flex flex-col items-end text-right w-full">

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-relaxed">
                تجربة صيانة متكاملة في جيبك
              </h2>

              <p className="mt-5 max-w-md text-gray-600 leading-8">
                حمل تطبيق عمرها الآن واستمتع بمميزات تتبع الطلب،
                الدفع الآمن، والدردشة المباشرة مع الفنيين.
              </p>

              {/* أزرار التحميل مرتبة بدقة تحت بعضها ومنتظمة على اليمين */}
              <div className="mt-8 flex flex-col sm:flex-row items-end gap-6 w-full">
                <a href="#" className="inline-block">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-12 w-auto"
                  />
                </a>

                <a href="#" className="inline-block">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="App Store"
                    className="h-12 w-auto"
                  />
                </a>
              </div>

            </div>

            {/* الصورة */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
              <img
                src="https://alharaminstore.com/wp-content/uploads/2025/05/Names-Of-Household-Appliances-In-English.jpg"
                alt="Home Appliances"
                className="w-[380px] max-w-full object-contain"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}