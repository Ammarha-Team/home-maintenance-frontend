export default function Reviews() {

  const reviews = [
    {
      text: "أكثر ما أعجبني هو سهولة الحجز عبر التطبيق والشفافية في الأسعار. خدمة السباكة كانت ممتازة ولم يعد هناك أي تسريب.",
      name: "محمد خالد",
      location: "دبي، الإمارات العربية المتحدة",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
    },
    {
      text: "تجربة رائعة! الفني وصل في الموعد المحدد وكان محترفاً جداً في إصلاح عطل التكييف. السعر كان عادلاً جداً مقارنة بالجودة.",
      name: "سارة أحمد",
      location: "الرياض، المملكة العربية السعودية",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
    },
    {
      text: "أنصح الجميع باستخدام تطبيق عمرها. الفنيون مدربون تدريباً عالياً وخدمة العملاء دائماً متعاونة وسريعة الاستجابة.",
      name: "أبو إبراهيم",
      location: "جدة، المملكة العربية السعودية",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    }
  ];


  return (

    <section 
      dir="rtl"
      className="bg-white py-16 font-sans"
    >

      <div className="max-w-6xl mx-auto px-6">


        {/* Title */}

        <h2 className="
          text-3xl
          font-bold
          text-gray-900
          mb-12
          text-right
        ">
          ماذا يقول عملاؤنا
        </h2>



        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-10
          items-center
        ">



{/* ================= IMAGES ================= */}

<div className="relative order-1">

  <div className="grid grid-cols-2 gap-4">

    {/* العمود اليمين */}
    <div className="flex flex-col gap-4">

      <img
        src="https://superiorplumbing.ca/wp-content/uploads/2023/04/HVAC-Repair-Technician-Promo1@2x.png"
        className="h-48 w-full rounded-3xl object-cover"
        alt=""
      />

      <img
        src="https://c0.uidownload.com/pngpics/1224/684/air-conditioning-maintenance-service-hvac-technician-refrigeration-repair-home-appliance-servicing-climate-control-solutions-professional-handyman-services-construction-industry-worker.png"
        className="h-56 w-full rounded-3xl object-cover"
        alt=""
      />

    </div>

    {/* العمود الشمال */}
    <div className="flex flex-col gap-4 pt-8">

      <img
        src="https://thumbs.dreamstime.com/b/skilled-hvac-technician-installing-air-conditioner-unit-commercial-building-conducting-routine-maintenance-service-safety-324266072.jpg"
        className="h-36 w-full rounded-3xl object-cover"
        alt=""
      />

      <img
        src="https://media.istockphoto.com/id/1169452249/photo/installation-service-fix-repair-maintenance-of-an-air-conditioner-indoor-unit-by-cryogenist.jpg?s=170667a&w=0&k=20&c=fFkbbqVOsvt7tZ3PEo5tS2KU5fUYVK7izcczkXtUvHY="
        className="h-40 w-full rounded-3xl object-cover"
        alt=""
      />

    </div>

  </div>

  {/* كارت نسبة الرضا */}

  <div
    className="
      absolute
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/1
      bg-blue-600
      text-white
      rounded-3xl
      w-30
      h-20
      flex
      flex-col
      justify-center
      items-center
      shadow-2xl
      z-20
    "
  >
    <span className="text-2xl font-bold">98%</span>
    <span className="text-sm mt-1">نسبة رضا العملاء</span>
  </div>

</div>







          {/* ================= REVIEWS ================= */}


          <div
            className="
              grid
              grid-cols-2
              gap-4
              order-2
            "
          >


            {
              reviews.map((review,index)=>(

                <div
                  key={index}
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    p-5
                    h-[185px]
                    flex
                    flex-col
                    justify-between
                  "
                >


                  <div>

                    <div className="
                      text-yellow-500
                      text-xs
                      mb-3
                    ">
                      ★★★★★
                    </div>


                    <p className="
                      text-gray-600
                      text-[11px]
                      leading-5
                    ">
                      "{review.text}"
                    </p>

                  </div>




                  <div className="
                    flex
                    items-center
                    gap-3
                  ">


                    <img
                      src={review.img}
                      className="
                        w-8
                        h-8
                        rounded-full
                        object-cover
                      "
                    />

                    <div>

                      <h4 className="
                        text-xs
                        font-bold
                      ">
                        {review.name}
                      </h4>


                      <p className="
                        text-[10px]
                        text-gray-400
                      ">
                        {review.location}
                      </p>


                    </div>


                  </div>


                </div>


              ))
            }




            {/* +35 */}

            <div
              className="
                bg-blue-50
                border
                border-blue-200
                rounded-2xl
                h-[185px]
                flex
                items-center
                justify-center
                text-blue-600
                font-bold
                text-lg
              "
            >
              + 35 رأي عملاء
            </div>



          </div>




        </div>


      </div>


    </section>

  );
}