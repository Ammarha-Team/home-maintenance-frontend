import { Link } from "react-router-dom";
import {
  Clock3,
  Image,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { TECHNICIAN_ROUTES } from "../../technician/constants/technicianRoutes.js";


export default function ServiceCard({

  image,
  title,
  description,
  price,
  status,
  location,
  time,
  imagesCount,

  onDelete,
  onEdit,

}) {


  const pending = status === "معلقة";


  return (

    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">


      <div className="flex flex-row-reverse gap-4">


        <img
          src={image}
          alt={title}
          className="w-[120px] h-[105px] rounded-xl object-cover shrink-0"
        />


        <div className="flex-1 text-right">


          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
            ${
              pending
              ? "bg-[#FFF4E5] text-[#F59E0B]"
              : "bg-[#EAF8EC] text-[#22C55E]"
            }`}
          >

            {status}

          </span>



          <h3 className="mt-2 text-lg font-bold text-[#1F2937]">
            {title}
          </h3>



          <p className="mt-2 text-sm text-[#6B7280] line-clamp-2">
            {description}
          </p>



          <div className="flex justify-end gap-4 mt-3 text-xs text-gray-400">


            <span className="flex items-center gap-1">

              <Clock3 size={14}/>

              {location} ({time})

            </span>



            <span className="flex items-center gap-1">

              <Image size={14}/>

              {imagesCount} صور

            </span>


          </div>


        </div>


      </div>




      <div className="border-t border-dashed my-4"/>




      <div className="text-right">

        <p className="text-sm text-gray-400">
          قيمة العرض
        </p>


        <h2 className="text-2xl font-bold text-blue-600">
          {price} ج.م
        </h2>

      </div>





      {
        pending ? (

          <div className="grid grid-cols-2 gap-3 mt-5">


            <button
              onClick={onDelete}
              className="h-11 rounded-xl border border-red-500 text-red-500 flex items-center justify-center gap-2"
            >

              <Trash2 size={16}/>

              حذف العرض

            </button>



            <button
              onClick={onEdit}
              className="h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2"
            >

              <Pencil size={16}/>

              تعديل العرض

            </button>


          </div>


        ) : (


          // The forward action on every offer card, and it had no handler, so
          // the card ended in a button that did nothing. The inbox is the only
          // place a conversation with the customer can happen.
          <Link
            to={TECHNICIAN_ROUTES.messages}
            className="mt-5 w-full h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2"
          >

            <MessageCircle size={17}/>

            بدء المحادثة مع العميل

          </Link>


        )

      }


    </div>

  );
}