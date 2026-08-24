import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, ClipboardList, ShieldCheck, Star } from "lucide-react";

import TechnicianStats from "../components/TechnicianStats";
import TechnicianInfo from "../components/TechnicianInfo";
import TechnicianOrders from "../components/TechnicianOrders";

import AdminDataState from "../../admin/components/AdminDataState.jsx";
import useAdminResource from "../../admin/hooks/useAdminResource.js";
import {
  activateUser,
  fetchAllTechnicians,
  fetchTechnician,
  suspendUser,
} from "../../admin/services/adminApi.js";
import { useToast } from "../../../shared/toast/toastContext.js";

import AccountStatusCard from "../../technician-review/components/AccountStatusCard.jsx";
// TEMPORARY — DEMO ONLY. Technician review has no backend behind it, and the
// API has nowhere to store why an account was suspended; see
// `modules/technician-review/services/technicianReviewStore.js`.
import {
  useReviewFor,
  useSuspensionFor,
} from "../../technician-review/hooks/useTechnicianReview.js";
import {
  clearSuspensionReason,
  markApproved,
  recordSuspensionReason,
} from "../../technician-review/services/technicianReviewStore.js";

/**
 * One technician, as the console reads them.
 *
 * The detail endpoint answers with more than the roster does — how many
 * requests in total, how many finished, how many people rated them — so the
 * three tiles are built from it rather than from the figures the component was
 * drawn with.
 *
 * The detail response carries no account state, so this screen used to guess:
 * it assumed every technician it opened was active and flipped a local boolean
 * once the API accepted a change. That was wrong the moment an already
 * suspended account was opened. The roster does carry `accountStatus`, so it is
 * read alongside the profile and the card below shows what the API actually
 * says rather than what this screen last did.
 */
export default function TechnicianSummary() {
  const { id } = useParams();

  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => fetchTechnician(id), [id]);

  const { data, error, loading, reload } = useAdminResource(load, { skip: !id });

  // `accountStatus` is on the roster DTO but not on the detail one, so the
  // roster is read too. Its own loading and failure are deliberately not
  // surfaced: the profile is the screen, and the status card simply shows
  // nothing until this arrives rather than blocking the page behind it.
  const {
    data: roster,
    reload: reloadRoster,
  } = useAdminResource(fetchAllTechnicians);

  const accountStatus =
    roster?.find((technician) => technician.id === data?.id)?.status ?? null;

  // TEMPORARY — DEMO ONLY. Called before the early returns below because it is
  // a hook; while the profile is still loading there is no email yet and the
  // answer is simply "unknown".
  const review = useReviewFor(data?.email);
  const suspension = useSuspensionFor(data?.email);

  /**
   * TEMPORARY — DEMO ONLY. Marks the interview as done.
   *
   * There is no approval endpoint, so this writes to the browser's own store
   * rather than calling anything. The profile is not reloaded afterwards: the
   * API response has no review field to re-read, and the card redraws off the
   * store subscription instead.
   */
  const approveReview = () => {
    if (!data?.email) {
      showToast({
        message: "تعذر إتمام المراجعة: لا يوجد بريد إلكتروني لهذا الفني.",
        variant: "error",
      });
      return;
    }

    markApproved(data.email);

    showToast({ message: `تمت مراجعة حساب ${data.fullName} والموافقة عليه` });
  };

  /**
   * Suspends or reinstates the account.
   *
   * The call itself is the real one — the endpoints take the *user* id, which
   * is a different key from the technician id the URL carries. The roster is
   * read back afterwards rather than patched here, because the API owns the
   * account state and reading it again is what proves the change landed.
   *
   * The reason travels alongside, not instead: it is written only after the API
   * accepts, and dropped when the account is reinstated so a stale note cannot
   * outlive the suspension it explained.
   */
  const changeAccountStatus = async (suspending, reasonKey) => {
    if (!data?.userId) {
      showToast({
        message: "تعذر تنفيذ الإجراء: لا يوجد معرف حساب لهذا الفني.",
        variant: "error",
      });
      return;
    }

    setBusy(true);

    try {
      await (suspending ? suspendUser : activateUser)(data.userId);

      if (suspending) {
        recordSuspensionReason(data.email, reasonKey);
      } else {
        clearSuspensionReason(data.email);
      }

      showToast({
        message: suspending
          ? `تم إيقاف حساب ${data.fullName}`
          : `تم تفعيل حساب ${data.fullName}`,
      });

      await reloadRoster();
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

          {/* The suspend/reinstate control lives in the account card below,
              where the current state and the reason sit beside it. A second
              copy up here could only repeat it, and used to contradict it. */}
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

          {/* TEMPORARY — DEMO ONLY. Only drawn for a technician this browser
              has a review entry for; the rest of the roster predates the flow
              and saying anything about their review would be an invention. */}
          {review.known ? (
            <div className="mt-4 rounded-[9px] border border-line bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-bold text-text-500">
                    مراجعة الحساب
                  </p>
                  <p className="mt-1 text-[11px] text-text-300">
                    {review.isApproved
                      ? "تم التحقق من الفني عبر المكالمة الهاتفية وتم فتح لوحة الفني."
                      : "لم تكتمل المقابلة الهاتفية بعد. لوحة الفني مغلقة حتى إتمام المراجعة."}
                  </p>
                </div>

                {review.isApproved ? (
                  <span className="rounded-[8px] bg-success-100 px-3 py-1.5 text-[11px] font-bold text-success-800">
                    تمت المراجعة
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={approveReview}
                    className="flex h-[32px] items-center gap-1.5 rounded-[7px] bg-primary-500 px-3 text-[11px] font-medium text-white transition hover:bg-primary-600"
                  >
                    <ShieldCheck size={13} />
                    إتمام المراجعة
                  </button>
                )}
              </div>
            </div>
          ) : null}


        </div>


      </div>

      <div className="mx-auto mt-4 max-w-[1200px]">
        <AccountStatusCard
          status={accountStatus}
          reason={suspension}
          busy={busy}
          onSuspend={(reasonKey) => changeAccountStatus(true, reasonKey)}
          onReinstate={() => changeAccountStatus(false)}
        />
      </div>
    </div>
  );
}
