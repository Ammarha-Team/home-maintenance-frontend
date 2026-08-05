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
