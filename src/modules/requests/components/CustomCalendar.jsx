import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomCalendar() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);


  const monthName = currentDate.toLocaleString("ar-EG", {
    month: "long",
  });

  const year = currentDate.getFullYear();


  const daysInMonth = new Date(
    year,
    currentDate.getMonth() + 1,
    0
  ).getDate();


  const firstDay = new Date(
    year,
    currentDate.getMonth(),
    1
  ).getDay();


  const days = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );


  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        currentDate.getMonth() - 1,
        1
      )
    );
  };


  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        currentDate.getMonth() + 1,
        1
      )
    );
  };


  return (
    <div
      dir="rtl"
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
    >

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <button
          onClick={previousMonth}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <ChevronRight size={18}/>
        </button>


        <h3 className="font-bold text-gray-800">
          {monthName} {year}
        </h3>


        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={18}/>
        </button>

      </div>


      {/* أيام الأسبوع */}

      <div className="grid grid-cols-7 text-center gap-2 mb-3">

        {
          [
            "أحد",
            "إثن",
            "ثلا",
            "أرب",
            "خمي",
            "جمع",
            "سبت"
          ].map(day => (
            <span
              key={day}
              className="text-xs text-gray-400"
            >
              {day}
            </span>
          ))
        }

      </div>



      {/* الأيام */}

      <div className="grid grid-cols-7 gap-3 text-center">

        {/* فراغ بداية الشهر */}

        {
          Array.from(
            { length: firstDay }
          ).map((_,i)=>(
            <div key={i}/>
          ))
        }


        {
          days.map(day => (

            <button
              key={day}
              onClick={() => setSelectedDate(day)}

              className={`
                h-9 w-9 mx-auto rounded-full text-sm transition

                ${
                  selectedDate === day
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
                }
              `}
            >
              {day}
            </button>

          ))
        }

      </div>

    </div>
  );
}