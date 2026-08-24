import { useNavigate, useParams } from "react-router-dom";

import HomeNavbar from "../../../shared/components/HomeNavbar";
import Footer from "../../../shared/components/Footer";
import TechnicianCard from "../components/TechnicianCard";
import ReviewForm from "../components/ReviewForm";
import { useToast } from "../../../shared/toast/toastContext.js";
import { CheckCircle } from "lucide-react";
import { useServiceRequest } from "../../orders/hooks/useServiceRequest";

// TEMPORARY — DEMO ONLY. See `orders/services/demoOfferAcceptance.js`.
import { useDemoAcceptance } from "../../orders/hooks/useDemoAcceptance.js";
import { recordDemoReview } from "../../orders/services/demoOfferAcceptance.js";

// لا يرفع كل فني صورة، فتُستخدم صورة عامة بدل رابط مكسور
const FALLBACK_AVATAR = "/technician_avatar.jpg";

export default function ReviewPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { request } = useServiceRequest(orderId);

  // TEMPORARY — DEMO ONLY. أي عرض ضغط عليه العميل. الخادم لا يعرف شيئًا عن هذا،
  // وكل ما يحدده هنا هو أي فني حقيقي تصفه البطاقة أدناه.
  const acceptance = useDemoAcceptance(orderId);

  const chosenOffer =
    (acceptance &&
      (request?.offers ?? []).find((offer) => offer.id === acceptance.offerId)) ||
    null;

  // نهاية الرحلة: يُشكر العميل على تقييمه ثم يعود إلى الرئيسية — الطلب انتهى،
  // فلا معنى لإبقائه على نموذج أرسله بالفعل ولا على شاشة تتبع لم يبقَ فيها شيء
  // يُتتبع
  //
  // TEMPORARY — DEMO ONLY. لا توجد نقطة نهاية للتقييم في الـ API، فيُحفظ التقييم
  // بجوار الطلب في المخزن المحلي ولا يصل إلى أحد، ولا يمسّ تقييم الفني الذي
  // يملكه الخادم.
  const handleSubmitted = (submitted) => {
    recordDemoReview(orderId, submitted);
    showToast({ message: "شكراً لك، تم إرسال تقييمك بنجاح" });
    navigate("/home");
  };

  const technician = {
    name: chosenOffer?.technicianName || "الفني",
    job: chosenOffer?.professionLabel || "",
    image: chosenOffer?.technicianProfilePicture || FALLBACK_AVATAR,
  };

  return (
    <>
      <HomeNavbar />

      <main className="min-h-screen bg-[#F8F9FC] py-12">
        <div className="max-w-xl mx-auto flex flex-col items-center px-4">
          <div className="bg-green-100 rounded-full p-5">
            <CheckCircle className="text-green-600" size={55} />
          </div>

          <h2 className="text-2xl font-bold text-green-600 mt-4">
            تم اكتمال الخدمة بنجاح!
          </h2>

          <p className="text-gray-500 mt-2 text-center">
            شكراً لاختيارك لنا، نأمل أن تكون الخدمة نالت رضاك.
          </p>

          <TechnicianCard technician={technician} />

          <ReviewForm onSubmitted={handleSubmitted} />
        </div>
      </main>

      <Footer />
    </>
  );
}