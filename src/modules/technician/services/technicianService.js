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

// The inbox (Figma node 22:3776).
//
// `online` drives the dot on the avatar and `unread` the highlight on the row.
export const CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'أحمد العتيبي',
    // The frame subtitles this with a trade, which is what a customer sees when
    // they open a technician. In the technician's own inbox the person opposite
    // is the customer, so the job stands in — it is what tells two threads apart
    // here.
    subtitle: 'تسريب مفاجئ في المطبخ',
    preview: 'على الطريق السريع 5 دقايق هكون...',
    stamp: 'الآن',
    online: true,
    unread: true,
    orderId: 'ord-45821',
  },
  {
    id: 'conv-2',
    name: 'خالد محمد',
    subtitle: 'تغيير مفاتيح الإنارة',
    preview: 'شكراً لك، تم إنجاز العمل بنجاح',
    stamp: 'أمس',
    online: false,
    unread: false,
    orderId: 'ord-45822',
  },
  {
    id: 'conv-3',
    name: 'فريق الدعم',
    subtitle: 'الدعم الفني',
    preview: 'تم تحديث حالة طلب رقم #1024',
    stamp: '١٢ أكتوبر',
    online: false,
    unread: false,
    orderId: null,
  },
]

// One thread per conversation. `from: 'me'` is the technician — the blue bubbles
// in the frame — and 'them' the customer.
export const THREADS = {
  'conv-1': [
    { id: 'm1', kind: 'day', text: 'اليوم' },
    { id: 'm2', kind: 'text', from: 'them', text: 'انت فين ؟؟', time: '09:41 ص' },
    {
      id: 'm3',
      kind: 'text',
      from: 'me',
      text: 'علي الطريق السريع 5 دقايق هكون عند حضرتك',
    },
    {
      id: 'm4',
      kind: 'text',
      from: 'me',
      text: 'تم الوصول للموقع',
      time: '09:42 ص',
      read: true,
    },
    { id: 'm5', kind: 'location', text: 'تمت مشاركة الموقع المباشر من قبل الفني' },
  ],
  'conv-2': [
    { id: 'm1', kind: 'day', text: 'أمس' },
    {
      id: 'm2',
      kind: 'text',
      from: 'them',
      text: 'شكراً لك، تم إنجاز العمل بنجاح',
      time: '05:12 م',
    },
  ],
  'conv-3': [
    { id: 'm1', kind: 'day', text: '١٢ أكتوبر' },
    {
      id: 'm2',
      kind: 'text',
      from: 'them',
      text: 'تم تحديث حالة طلب رقم #1024',
      time: '11:03 ص',
    },
  ],
}

/** The conversation behind a selected id, falling back to the first thread. */
export const findConversation = (conversationId) =>
  CONVERSATIONS.find((conversation) => conversation.id === conversationId) ??
  CONVERSATIONS[0]
