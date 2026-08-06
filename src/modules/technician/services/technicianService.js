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
