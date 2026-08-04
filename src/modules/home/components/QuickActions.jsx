import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuickActions({ onRequestClick }) {
  const navigate = useNavigate();

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 w-full my-15"
      dir="rtl"
    >

      {/* الكارت الكبير */}
      <div className="relative h-[300px] rounded-xl overflow-hidden group shadow-sm">
       <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://www.coimbatoreservicecenter.in/image/bosch-washing-machine-service.jpg')",
          }}
        />



        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />

        <div className="pt-20 relative z-10 h-full flex flex-col justify-center items-start px-5 text-right">
          <h3 className="text-white text-xl font-bold mb-2">
            مش عارف المشكلة؟
          </h3>

          <p className="text-gray-200 text-sm mb-5">
            اطلب تشخيصاً فورياً لحالة طارئة
          </p>

          <button
            onClick={() => navigate("/emergency-diagnosis")}
            className="
              bg-red-700 
              hover:bg-red-800 
              text-white 
              text-sm 
              px-30 
              py-2 
              rounded-lg
              transition
            "
          >
            اطلب فحص الآن
          </button>
        </div>

      </div>


      {/* الكارت الصغير */}
      <div className="relative h-[300px] rounded-xl overflow-hidden group shadow-sm">

 
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://tse1.mm.bing.net/th/id/OIP.IcY2JtG0F_jNezlCZvpYNwHaEK?r=0&w=1600&h=898&rs=1&pid=ImgDetMain&o=7&rm=3')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />


        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-5 pt-20">

          <h3 className="text-white text-lg font-bold mb-2">
            كيف يمكننا مساعدتك في منزلك اليوم؟
          </h3>

          <p className="text-gray-200 text-sm mb-5">
            اطلب فني متخصص في أقل من دقيقة
          </p>


          <button
            onClick={onRequestClick}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm
              px-25
              py-2
              rounded-lg
              transition
            "
          >
            إنشاء طلب جديد
          </button>

        </div>

      </div>

    </div>
  );
}