import { ClipboardCheck, PhoneCall, ShieldCheck, UserCheck } from 'lucide-react'

// TEMPORARY — DEMO ONLY. Part of the frontend-only technician review flow; see
// `../services/technicianReviewStore.js`.
//
// The card a technician sees between registering and being let into the portal.
// It is deliberately the same shape as `AccountCreatedPanel` — bordered white
// card, circular icon, heading, explanation, then the actions — because the two
// screens sit back to back in the sign-up flow and a different silhouette would
// read as a different product.
//
// Actions are passed in as children rather than built here: the same card ends
// the sign-up flow, where the useful thing to offer is the confirmation mail,
// and greets a signed-in technician, where it is a way out.

// The three steps, in the order they happen. Numbered because this genuinely is
// a sequence — the call cannot come before the account exists, and the portal
// cannot open before the call.
const STEPS = [
  {
    key: 'created',
    icon: UserCheck,
    title: 'تم إنشاء الحساب',
    body: 'بياناتك وصلت إلينا بنجاح وأصبح حسابك مسجلًا في المنصة.',
  },
  {
    key: 'call',
    icon: PhoneCall,
    title: 'مكالمة من فريق المراجعة',
    body: 'سيتواصل معك فريقنا هاتفيًا لاستكمال المقابلة والتحقق من بيانات التخصص والخبرة.',
  },
  {
    key: 'access',
    icon: ClipboardCheck,
    title: 'تفعيل الوصول للوحة الفني',
    body: 'بعد اكتمال المراجعة يتم فتح لوحة الفني ويمكنك استقبال الطلبات وتقديم العروض.',
  },
]

function UnderReviewPanel({ email, children }) {
  return (
    <section
      dir="rtl"
      className="flex flex-col items-center gap-[24px] rounded-[12px] border border-line bg-white p-[24px] text-center sm:p-[32px]"
    >
      <span
        aria-hidden="true"
        className="flex size-[72px] items-center justify-center rounded-full bg-primary-50 text-primary-500"
      >
        <ShieldCheck className="size-[32px]" />
      </span>

      <div className="flex flex-col items-center gap-[12px]">
        <span className="rounded-full bg-primary-50 px-[14px] py-[6px] text-[14px] font-bold text-primary-900">
          الحساب قيد المراجعة
        </span>

        <h2 className="text-[24px] leading-[1.5] font-bold text-text-500">
          تم إنشاء حسابك بنجاح
        </h2>

        <p className="max-w-[520px] text-[16px] leading-[1.6] text-text-300">
          حسابك الآن قيد المراجعة من قبل فريق المنصة. نتحقق من بيانات كل فني قبل
          فتح لوحة التحكم، حتى نضمن جودة الخدمة للعملاء. لن تتمكن من الدخول إلى
          لوحة الفني حتى تكتمل المراجعة.
        </p>
      </div>

      {email ? (
        <p dir="ltr" className="text-[18px] leading-[1.5] font-bold break-all text-text-500">
          {email}
        </p>
      ) : null}

      {/* The steps read top to bottom rather than as a row of cards: they are
          consecutive, and a row invites the eye to compare them instead of
          following them. */}
      <ol className="flex w-full flex-col gap-[16px] text-start">
        {STEPS.map((step, index) => {
          const Icon = step.icon

          return (
            <li
              key={step.key}
              className="flex items-start gap-[12px] rounded-[12px] border border-line bg-card p-[16px]"
            >
              <span
                aria-hidden="true"
                className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500"
              >
                <Icon className="size-[18px]" />
              </span>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[15px] font-bold text-text-500">
                  {index + 1}. {step.title}
                </p>
                <p className="text-[14px] leading-[1.6] text-text-300">{step.body}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {children ? <div className="flex w-full flex-col gap-[12px]">{children}</div> : null}
    </section>
  )
}

export default UnderReviewPanel
