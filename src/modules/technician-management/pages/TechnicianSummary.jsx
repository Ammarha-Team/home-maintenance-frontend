import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Ban, CheckCircle, CircleCheck, ClipboardList, Star } from "lucide-react";

import TechnicianStats from "../components/TechnicianStats";
import TechnicianInfo from "../components/TechnicianInfo";
import TechnicianOrders from "../components/TechnicianOrders";
import TechnicianAccountStatus from "../components/TechnicianAccountStatus";

import AdminDataState from "../../admin/components/AdminDataState.jsx";
import useAdminResource from "../../admin/hooks/useAdminResource.js";
import {
  activateUser,
  fetchTechnician,
  suspendUser,
} from "../../admin/services/adminApi.js";
import { useToast } from "../../../shared/toast/toastContext.js";

/**
 * One technician, as the console reads them.
 *
 * The detail endpoint answers with more than the roster does — how many
 * requests in total, how many finished, how many people rated them — so the
 * three tiles are built from it rather than from the figures the component was
 * drawn with.
 *
 * The account state is not part of this response, so the button below tracks
 * what it has done rather than what the account is: it starts on "suspend" and
 * flips once the API accepts. The roster is where the settled state is read
 * back.
 */
export default function TechnicianSummary() {
  const { id } = useParams();

  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [suspended, setSuspended] = useState(false);

  const load = useCallback(() => fetchTechnician(id), [id]);

  const { data, error, loading, reload } = useAdminResource(load, { skip: !id });

  const toggleAccount = async () => {
    if (!data?.userId) {
      showToast({
        message: "تعذر تنفيذ الإجراء: لا يوجد معرف حساب لهذا الفني.",
        variant: "error",
      });
      return;
    }

    setBusy(true);

    try {
      await (suspended ? activateUser : suspendUser)(data.userId);

      showToast({
        message: suspended
          ? `تم تفعيل حساب ${data.fullName}`
          : `تم إيقاف حساب ${data.fullName}`,
      });

      setSuspended((current) => !current);
    } catch (failure) {
      showToast({
        message: failure.message || "تعذر تحديث حالة الحساب.",
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  // The sidebar also advertises /admin/technicians/summary, which carries no
  // id. Saying so beats loading a profile for nobody.
  if (!id) {
    return <AdminDataState error={new Error("اختر فنيًا من القائمة لعرض ملفه.")} />;
  }

  if (loading || error) {
    return (
      <AdminDataState
        loading={loading}
        error={error}
        onRetry={reload}
        label="جاري تحميل ملف الفني..."
      />
    );
  }

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: String(data?.totalRequests ?? 0),
      description: `${data?.completedRequests ?? 0} طلب مكتمل`,
      icon: ClipboardList,
      iconClass: "text-primary-500",
    },
    {
      title: "الطلبات المكتملة",
      value: String(data?.completedRequests ?? 0),
      description: `من إجمالي ${data?.totalRequests ?? 0} طلب`,
      icon: CheckCircle,
      iconClass: "text-green-500",
    },
    {
      title: "متوسط التقييم",
      value: String(data?.averageRating ?? data?.rating ?? 0),
      description: `من ${data?.ratingsCount ?? 0} تقييم`,
      icon: Star,
      iconClass: "text-yellow-500",
    },
  ];

  return (
    <div dir="rtl" className="w-full">
      {/* Header */}
      <div className="mx-auto mb-5 max-w-[1200px]">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px]">
              <span className="text-text-400">
                الفنيين
              </span>

              <span className="text-text-200">/</span>

              <span className="font-medium text-primary-500">
                تفاصيل الفني
              </span>
            </div>

            <h1 className="text-[18px] font-bold text-text-500">
              ملف الفني: {data?.fullName ?? "—"}
            </h1>
          </div>

          <button
            type="button"
            onClick={toggleAccount}
            disabled={busy}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-red-100 bg-white px-4 text-[11px] font-medium text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suspended ? "تفعيل الحساب" : "إيقاف الحساب"}
            {suspended ? <CircleCheck size={13} /> : <Ban size={13} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">

        {/* Technician Info */}
        <TechnicianInfo technician={data} />

        {/* Stats + Orders + Account Status */}
        <div className="min-w-0">
          <TechnicianStats stats={stats} />

          <div className="mt-4">
            <TechnicianOrders orders={data?.recentRequests ?? []} />
          </div>


        </div>


      </div>

       <div className="mt-10">
            <TechnicianAccountStatus />
          </div>
    </div>
  );
}
