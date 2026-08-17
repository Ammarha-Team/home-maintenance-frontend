import attachmentPipe from '../../../assets/technician/attachment-pipe.png'
import attachmentSink from '../../../assets/technician/attachment-sink.png'
import attachmentTap from '../../../assets/technician/attachment-tap.png'
import requestAc from '../../../assets/technician/request-ac.png'
import requestLighting from '../../../assets/technician/request-lighting.png'
import requestPlumbing from '../../../assets/technician/request-plumbing.png'

// Stand-in data for the technician portal until the API exists. Values are the
// ones the Figma frame draws (node 21:2028), so the screen can be reviewed
// against the design without a backend.
//
// Times and dates are display strings, not timestamps: the frame writes them in
// Arabic and nothing here parses or reformats them. When the API lands, this
// module becomes the fetch layer and the shapes below become its response
// contract.

export const TECHNICIAN = {
  name: 'أحمد',
  available: true,
  city: 'شارع التخصصي، الرياض',
}

export const TODAY_STATS = {
  earnings: 140,
  currency: 'ج.م',
  completedCount: 2,
  rating: 4.8,
  ratingDelta: '+0.2',
  platformDue: 155,
  dueDays: 4,
}

export const CURRENT_JOB = {
  id: '#99214',
  status: 'قيد التنفيذ',
  title: 'إصلاح السباكة',
  address: '١٢٣ شارع مابل، نورث هيلز',
  coords: { lat: 24.7136, lng: 46.6753 },
}

// `urgency` drives the chip: emergency is the red tone in the frame, normal the
// neutral one.
export const NEW_REQUESTS = [
  {
    id: 'req-1',
    age: 'منذ 5 دقائق',
    urgency: 'emergency',
    title: 'صيانه لوحه مفاتيح',
    district: 'حي النرجس، الرياض',
  },
  {
    id: 'req-2',
    age: 'منذ 5 دقائق',
    urgency: 'emergency',
    title: 'صيانه لوحه مفاتيح',
    district: 'حي النرجس، الرياض',
  },
  {
    id: 'req-3',
    age: 'منذ 5 دقائق',
    urgency: 'normal',
    title: 'صيانه لوحه مفاتيح',
    district: 'حي النرجس، الرياض',
  },
]

export const SCHEDULED_JOBS = [
  {
    id: 'job-1',
    title: 'تركيب مروحه',
    time: 'الساعة 04:30 م',
    customer: 'فيصل عبد العزيز',
  },
  {
    id: 'job-2',
    title: 'تنظيف مكيف سبلت',
    time: 'الساعة 07:00 م',
    customer: 'عبد الله محمد',
  },
]

// The job board behind the three order screens (Figma nodes 21:2236, 21:2465
// and 21:2617).
//
// One record serves all three: the board lists them, the details screen opens
// one, and the offer form summarises the same one — so a field added here
// reaches every place that needs it instead of being written out three times.
//
// `photo` and `gallery` hold the frame's own images, which is where the API's
// URLs will go, so the screens read the same field names either way.

export const ORDER_CATEGORIES = ['كهرباء', 'سباكه', 'تكييف', 'نجارة']

export const ORDER_URGENCIES = [
  { key: 'all', label: 'الكل' },
  { key: 'emergency', label: 'طواري' },
  { key: 'normal', label: 'عادي' },
]

// The platform's cut, and the only arithmetic the offer form does.
export const PLATFORM_COMMISSION_RATE = 0.15
export const CURRENCY = 'ج.م'

export const ORDERS = [
  {
    id: 'ord-45821',
    reference: '#45821',
    category: 'سباكه',
    urgency: 'emergency',
    age: 'منذ ٥ دقائق',
    title: 'تسريب مفاجئ في المطبخ',
    summary:
      'يوجد تسريب مياه قوي تحت الحوض يحتاج لإصلاح فوري لمنع تلف الخزانات الخشبية. المياه تتسرب من الوصلة الرئيسية خلف الغسالة...',
    description:
      'يوجد تسريب مياه حاد في دورة المياه الرئيسية تحت الحوض. يبدو أن هناك كسر في المحبس الرئيسي المؤدي للغسالة. المياه تتجمع بسرعة خلف الخزانة الخشبية مما قد يؤدي لتلف الأثاث. أحتاج لفني خبرة للقيام بالإصلاح فوراً وتغيير القطع التالفة بقطع أصلية.',
    district: 'المعادي',
    distance: '1.2 كم',
    attachmentLabel: '٣ صور مرفقة',
    schedule: null,
    photo: requestPlumbing,
    // Reversed against the frame, which reads tap, pipe, sink from the left:
    // the gallery is a RTL grid, so its first entry is the one furthest right.
    gallery: [attachmentSink, attachmentPipe, attachmentTap],
    address: '782 بروسبكت بليس، بروكلين، نيويورك',
    travelTime: 'على بعد 12 دقيقة من موقعك الحالي',
    coords: { lat: 24.7136, lng: 46.6753 },
    locationSummary: 'الرياض، حي الملقا • يبعد 3.5 كم',
    customer: {
      name: 'أحمد عبد العزيز',
      reference: '#67788',
      verified: true,
      previousOffers: 5,
    },
  },
  {
    id: 'ord-45822',
    reference: '#45822',
    category: 'كهرباء',
    urgency: 'normal',
    age: 'منذ ساعة',
    title: 'تغيير مفاتيح الإنارة',
    summary:
      'أحتاج لفني لتغيير مجموعة من مفاتيح الكهرباء وتركيب نجفة جديدة في الصالة. المفاتيح مشتراة بالفعل وجاهزة للتركيب...',
    description:
      'أحتاج لفني لتغيير مجموعة من مفاتيح الكهرباء وتركيب نجفة جديدة في الصالة. المفاتيح مشتراة بالفعل وجاهزة للتركيب، والنجفة موجودة في المنزل.',
    district: 'دجلة',
    distance: '3.5 كم',
    attachmentLabel: 'لا يوجد مرفقات',
    schedule: 'غداً، ١٠ ص',
    photo: requestLighting,
    gallery: [],
    address: 'دجلة، المعادي، القاهرة',
    travelTime: 'على بعد 18 دقيقة من موقعك الحالي',
    coords: { lat: 29.9602, lng: 31.2569 },
    locationSummary: 'القاهرة، دجلة • يبعد 3.5 كم',
    customer: {
      name: 'سارة إبراهيم',
      reference: '#67789',
      verified: true,
      previousOffers: 2,
    },
  },
  {
    id: 'ord-45823',
    reference: '#45823',
    category: 'تكييف',
    urgency: 'normal',
    age: 'منذ ساعتين',
    title: 'صيانة دورية للمكيفات',
    summary:
      'صيانة دورية لـ ٣ أجهزة تكييف سبليت تشمل تنظيف الفلاتر وفحص غاز التبريد قبل دخول فصل الصيف...',
    description:
      'صيانة دورية لـ ٣ أجهزة تكييف سبليت تشمل تنظيف الفلاتر وفحص غاز التبريد قبل دخول فصل الصيف. الأجهزة تعمل لكن التبريد ضعيف في الغرفتين العلويتين.',
    district: 'مدينة نصر',
    distance: '5.0 كم',
    attachmentLabel: 'لا يوجد مرفقات',
    schedule: 'غداً، ١٢ م',
    photo: requestAc,
    gallery: [],
    address: 'مدينة نصر، القاهرة',
    travelTime: 'على بعد 25 دقيقة من موقعك الحالي',
    coords: { lat: 30.0511, lng: 31.3656 },
    locationSummary: 'القاهرة، مدينة نصر • يبعد 5.0 كم',
    customer: {
      name: 'محمود حسن',
      reference: '#67790',
      verified: false,
      previousOffers: 0,
    },
  },
]

/** The order behind an `:orderId` route, or undefined when the id is unknown. */
export const findOrder = (orderId) =>
  ORDERS.find((order) => order.id === orderId)

// The job a technician works once the customer accepts the offer (Figma nodes
// 22:3934, 22:3431, 22:3542 and 22:3667).
//
// The four stages below are the same list on three screens; what changes is how
// far down it the job has got, so each screen names a stage and the timeline
// works out what is done, current and still waiting. Keeping the copy here means
// the timeline and the status chip can never describe the job differently.

export const JOB_STAGES = [
  { key: 'accepted', title: 'تم قبول الطلب', detail: '09:15 ص', doneDetail: '09:15 ص' },
  {
    key: 'enroute',
    title: 'في الطريق',
    detail: 'جاري الوصول في غضون 8 دقائق',
    doneDetail: 'جاري الوصول في غضون 8 دقائق',
  },
  {
    key: 'arrived',
    title: 'تم الوصول لموقع العميل',
    detail: 'انتظار',
    doneDetail: 'تم وصول لموقع العميل',
  },
  {
    key: 'completed',
    title: 'تم تاكيد انهاء الخدمه',
    detail: 'انتظار',
    doneDetail: 'تم اكمال الخدمه',
  },
]

/**
 * Where a stage sits relative to the one the job has reached.
 *
 * A key that names no stage means the job is past all of them, which is how the
 * closing screen shows the whole list as done.
 */
export const stageStatus = (stageKey, currentKey) => {
  const at = JOB_STAGES.findIndex((stage) => stage.key === currentKey)
  if (at === -1) return 'done'

  const index = JOB_STAGES.findIndex((stage) => stage.key === stageKey)

  if (index < at) return 'done'
  if (index === at) return 'current'
  return 'waiting'
}

// The accepted job. `orderId` ties it back to the request it came from, so the
// order screens and these share one record rather than describing one job twice.
export const ACTIVE_JOB = {
  orderId: 'ord-45821',
  reference: '#8842',
  customerReference: '#67788',
  serviceType: 'صيانة تكييف مركزي - تسريب غاز',
  address: 'حي النرجس، فيلا 24، الرياض',
  // The offer the customer accepted. The frame writes 450 on the acceptance
  // screen and settles 100 on the closing one; one job cannot be worth both, so
  // the accepted amount is the single source and the closing screen divides it.
  amount: 450,
}

/** What the technician keeps once the platform has taken its cut. */
export const earningsFor = (amount) => {
  const commission = amount * PLATFORM_COMMISSION_RATE
  return { total: amount, commission, net: amount - commission }
}

// The inbox is no longer described here. It reads the live conversations and
// messages from the chat module — the same hub and the same two endpoints the
// customer's inbox uses — so there is nothing left for this file to invent.

// The wallet and the settlement that follows it (Figma nodes 22:2926, 22:3064,
// 22:3169, 22:3249 and 22:3345).
//
// Everything these five screens say about money comes from one figure — what
// the completed orders billed. The commission, the net and the amount owed are
// all worked out from it by `walletTotals`, so the screens cannot disagree.
//
// The frames write those figures as 2,882 / -432 / 2,600 with 450 owed, which
// does not reconcile: 2,882 less 432 is 2,450, not 2,600, and 15% of 2,882 is
// 432.30, not 450. Rather than copy four numbers that contradict each other
// onto screens a technician would check against their own records, the billed
// total is taken as given and the rest derived.
export const WALLET = {
  completedCount: 42,
  weekEarnings: 3200,
  // إجمالي الطلبات المنفذة — what the finished jobs billed, before commission.
  billed: 2882,
  dueDays: 4,
  // How long is left to settle, as the frame writes it. Display values rather
  // than a deadline: a live countdown needs a timestamp from the API, and one
  // invented here would tick down to a moment that means nothing.
  countdown: [
    { key: 'days', value: 4, label: 'يوم' },
    { key: 'hours', value: 42, label: 'ساعه' },
    { key: 'minutes', value: 15, label: 'دقيقه' },
  ],
  period: 'فترة: 12 - 19 أكتوبر',
}

/**
 * The wallet's figures, and the one the technician owes.
 *
 * `due` is the commission: the platform's cut is exactly what has to be paid
 * back, and that is what the settlement flow collects.
 */
export const walletTotals = () => {
  const { total, commission, net } = earningsFor(WALLET.billed)
  return { billed: total, commission, net, due: commission }
}

// Past settlements, newest first. `settled` drives the green badge.
export const WALLET_HISTORY = [
  { id: 'may-2024', amount: 1120, month: 'مايو 2024', orders: 18, settled: true },
  { id: 'apr-2024', amount: 1480, month: 'أبريل 2024', orders: 24, settled: true },
]

// How the commission can be paid (Figma node 22:3169).
//
// `tone` picks the tint behind the icon, matching the frame's three colours.
// The brand marks the frame draws are not shipped with this project, so each
// method carries a lucide icon describing what it is instead.
//
// The card option is drawn exactly as designed but cannot be chosen. The
// confirmation frame that follows is the e-wallet one — it asks for a mobile
// number and explains a wallet PIN prompt. Nothing was designed for paying by
// card, so offering it would lead to a screen that does not exist.
export const PAYMENT_METHODS = [
  {
    key: 'vodafone',
    name: 'فودافون كاش',
    hint: 'الدفع السريع عبر الهاتف',
    tone: 'error',
    available: true,
  },
  {
    key: 'instapay',
    name: 'انستا باي',
    hint: 'تحويل بنكي لحظي مباشر',
    tone: 'success',
    available: true,
  },
  {
    key: 'card',
    name: 'بطاقة ائتمان / خصم',
    hint: 'فيزا، ماستر كارد، ميزة',
    tone: 'primary',
    available: false,
  },
]

/** The method behind a key, falling back to the first one that can be used. */
export const findPaymentMethod = (methodKey) =>
  PAYMENT_METHODS.find((method) => method.key === methodKey) ??
  PAYMENT_METHODS.find((method) => method.available)

// What follows "تأكيد الدفع", as the confirmation frame explains it.
export const PAYMENT_STEPS = [
  'أدخل رقم الموبايل المسجل في خدمة فودافون كاش أو أي محفظة إلكترونية أخرى.',
  'ستتلقى طلباً على هاتفك لإدخال الرقم السري لمحفظتك لتأكيد العملية.',
  'بمجرد التأكيد، سيتم خصم المبلغ وإتمام العملية فوراً وبشكل آمن.',
]

// The receipt (Figma node 22:3345). The reference, date and time are the
// frame's. The amount and the method are not held here: they are whatever was
// just paid, so the closing screen is handed those.
export const PAYMENT_RECEIPT = {
  reference: '#TRX-992834',
  date: '15 مايو 2024',
  time: '10:30 صباحاً',
}
