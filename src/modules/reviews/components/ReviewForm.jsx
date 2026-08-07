import { useState } from "react";
import RatingStars from "./RatingStars";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    console.log({
      rating,
      comment,
    });
  };

  return (
    <div
      dir="rtl"
      className="mt-6 w-full max-w-[500px] rounded-2xl bg-white border border-[#E8ECF4] shadow-sm p-6"
    >
      <h3 className="text-center text-xl font-bold text-[#2F6FED]">
        تقييم الفني
      </h3>

      <div className="mt-5 flex justify-center">
        <RatingStars
          rating={rating}
          setRating={setRating}
        />
      </div>

      <textarea
        rows={5}
        placeholder="اكتب تعليقك هنا..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="
          mt-6
          w-full
          rounded-xl
          border
          border-[#D9DDE5]
          bg-white
          px-4
          py-3
          text-sm
          text-right
          placeholder:text-gray-400
          resize-none
          outline-none
          transition
          focus:border-[#2F6FED]
          focus:ring-2
          focus:ring-blue-100
        "
      />

      <button
        onClick={handleSubmit}
        className="
          mt-6
          h-12
          w-full
          rounded-xl
          bg-[#2F6FED]
          text-white
          font-semibold
          transition
          hover:bg-[#2559D6]
        "
      >
        إرسال التقييم
      </button>
    </div>
  );
}