import { useState } from 'react'
import { Ban, CircleCheck, LoaderCircle } from 'lucide-react'

import {
  SUSPENSION_REASONS,
  suspensionReasonLabel,
} from '../services/technicianReviewStore.js'

// Suspending and reinstating are REAL — `PUT /api/Admin/users/{id}/suspend` and
// `/activate`, and `accountStatus` on the roster is the API's own answer. The
// only temporary part is the reason, which the API has nowhere to store; see
// `../services/technicianReviewStore.js`.
//
// This replaces `technician-management/components/TechnicianAccountStatus`,
// which announced that a named week's dues had been paid and offered a button
// that did nothing. Both were drawn from a mockup rather than read from
// anything, and stating a settled account as fact is worse than saying nothing.
//
// What is deliberately absent: any figure. The API publishes no per-technician
// fee, balance or commission — the one mention anywhere in the backend is the
// dashboard's `pendingCommissions`, which is hard-coded to zero behind a TODO.
// So the admin records *why* an account was stopped and nothing about how much.

const STATUS_PILL = {
  active: { label: 'نشط', className: 'bg-success-100 text-success-800' },
  suspended: { label: 'موقوف', className: 'bg-error-50 text-error-500' },
}

function AccountStatusCard({ status, reason, busy = false, onSuspend, onReinstate }) {
  const [reasonKey, setReasonKey] = useState(SUSPENSION_REASONS[0].key)

  const pill = STATUS_PILL[status] ?? null
  const suspended = status === 'suspended'

  return (
    <div dir="rtl" className="rounded-[9px] border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold text-text-500">حالة الحساب</p>

          <p className="mt-1 text-[11px] text-text-300">
            {suspended
              ? 'الحساب موقوف ولا يمكن للفني استقبال طلبات جديدة.'
              : 'الحساب نشط ويمكن للفني استقبال الطلبات.'}
          </p>

          {/* Only shown when an admin actually wrote one down. A suspension
              carried out before this existed, or from another browser, has no
              note — and inventing one would defeat the point. */}
          {suspended && reason ? (
            <p className="mt-2 text-[11px] font-medium text-error-500">
              السبب المسجل: {suspensionReasonLabel(reason.reason) ?? reason.reason}
            </p>
          ) : null}
        </div>

        {pill ? (
          <span className={`rounded-[8px] px-3 py-1.5 text-[11px] font-bold ${pill.className}`}>
            {pill.label}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {suspended ? (
          <button
            type="button"
            onClick={onReinstate}
            disabled={busy}
            className="flex h-[32px] items-center gap-1.5 rounded-[7px] bg-primary-500 px-3 text-[11px] font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <CircleCheck size={13} />
            )}
            إعادة تنشيط الحساب
          </button>
        ) : (
          <>
            <label htmlFor="suspension-reason" className="text-[11px] text-text-400">
              سبب الإيقاف
            </label>

            <select
              id="suspension-reason"
              value={reasonKey}
              onChange={(event) => setReasonKey(event.target.value)}
              className="h-[32px] rounded-[7px] border border-line bg-white px-2 text-[11px] text-text-500"
            >
              {SUSPENSION_REASONS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onSuspend?.(reasonKey)}
              disabled={busy}
              className="flex h-[32px] items-center gap-1.5 rounded-[7px] border border-error-100 bg-white px-3 text-[11px] font-medium text-error-500 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <LoaderCircle size={13} className="animate-spin" /> : <Ban size={13} />}
              إيقاف الحساب
            </button>
          </>
        )}
      </div>

      {/* Said on the screen, not just in a comment: an admin looking for the
          amount owed needs to know the platform cannot tell them yet. */}
      <p className="mt-3 border-t border-line pt-3 text-[10px] leading-[1.6] text-text-200">
        لا تتوفر حاليًا بيانات الرسوم أو العمولات المستحقة من الـ API، لذلك لا يعرض
        هذا القسم أي مبالغ. الإيقاف والتنشيط يتمان فعليًا عبر الـ API، بينما يُحفظ
        سبب الإيقاف مؤقتًا في هذا المتصفح فقط.
      </p>
    </div>
  )
}

export default AccountStatusCard
