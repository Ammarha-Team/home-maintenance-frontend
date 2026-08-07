import { Link } from 'react-router-dom'
import SuccessSeal from '../../../shared/components/SuccessSeal.jsx'
import TechnicianLayout from '../../../shared/layouts/TechnicianLayout.jsx'
import JobStageTimeline from '../components/JobStageTimeline.jsx'
import { TECHNICIAN_ROUTES } from '../constants/technicianRoutes.js'
import {
  ACTIVE_JOB,
  CURRENCY,
  PLATFORM_COMMISSION_RATE,
  earningsFor,
} from '../services/technicianService.js'

const money = (amount) => `${amount.toFixed(2)} ${CURRENCY}`

/**
 * The job is finished and settled (Figma node 22:3667).
 *
 * Two halves: the confirmation on the right, and on the left the completed
 * stage list with what the job actually paid. The stage list is passed a key
 * that names no stage, which marks every step done.
 *
 * The commission is worked out from the accepted amount rather than written
 * down, so the three lines always add up.
 */
function TechnicianJobCompletion() {
  const { total, commission, net } = earningsFor(ACTIVE_JOB.amount)
  const percent = Math.round(PLATFORM_COMMISSION_RATE * 100)

  return (
    <TechnicianLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] py-[32px] lg:flex-row lg:items-start lg:px-[80px] lg:py-[48px]">
        {/* The confirmation sits on the right in the frame, so it is written
            first — the first child of an RTL row being the rightmost. */}
        <section className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[8px] rounded-[12px] border border-line bg-white px-[24px] py-[64px] text-center lg:py-[180px]">
          <SuccessSeal className="size-[120px] md:size-[160px]" />

          <h1 className="text-[20px] leading-[1.5] font-bold text-success-500 md:text-[24px]">
            تم انهاء الخدمه بنجاح
          </h1>
          <p className="text-[18px] leading-[1.5] text-text-300 md:text-[20px]">
            سيتم اضافة الخدمة في حسابك الشخصي
          </p>
        </section>

        <aside className="flex w-full flex-col gap-[24px] rounded-[12px] border border-line bg-white p-[25px] lg:w-[440px] lg:shrink-0">
          <JobStageTimeline current="finished" />

          <p className="text-right text-[16px] leading-[1.5] text-text-300">
            {`تم اضافة عمولة ${percent} % يجب سدادها ف اقرب وقت`}
          </p>

          <dl className="flex flex-col gap-[12px] rounded-[8px] bg-primary-50 p-[16px]">
            <div className="flex items-center justify-between gap-[16px]">
              <dt className="text-[16px] leading-[1.5] text-text-400">
                إجمالي الخدمة
              </dt>
              <dd className="text-[16px] leading-[1.5] font-bold text-text-500">
                {money(total)}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-[16px]">
              <dt className="text-[16px] leading-[1.5] text-text-400">
                {`عمولة المنصة (${percent}%)`}
              </dt>
              <dd className="text-[16px] leading-[1.5] font-bold text-error-500">
                {`-${money(commission)}`}
              </dd>
            </div>

            <div className="h-px w-full bg-primary-100" />

            <div className="flex items-center justify-between gap-[16px]">
              <dt className="text-[16px] leading-[1.5] font-bold text-primary-500">
                أرباحك
              </dt>
              <dd className="text-[18px] leading-[1.5] font-bold text-primary-500">
                {money(net)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-[12px]">
            {/* The commission this screen just named is what the wallet asks
                to be settled, so this goes straight there. */}
            <Link
              to={TECHNICIAN_ROUTES.wallet}
              className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-primary-500 text-[18px] font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              الذهاب للمحفظه
            </Link>

            <Link
              to={TECHNICIAN_ROUTES.dashboard}
              className="flex h-[56px] w-full items-center justify-center rounded-[12px] border border-primary-500 text-[18px] font-bold text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              العوده للرئيسيه
            </Link>
          </div>
        </aside>
      </div>
    </TechnicianLayout>
  )
}

export default TechnicianJobCompletion
