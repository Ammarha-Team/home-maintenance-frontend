import { Star } from "lucide-react";

export default function RatingStars({
  rating,
  setRating,
}) {
  return (
    <div className="flex justify-center gap-2">

      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={30}
          onClick={() => setRating(star)}
          className={`cursor-pointer transition ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}

    </div>
  );
}