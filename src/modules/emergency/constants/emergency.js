// Routes for the emergency flow. `/emergency-diagnosis` already exists as a
// destination in the home screen's quick actions (QuickActions.jsx) but had no
// handler, so it is kept as an alias into the request screen.
export const EMERGENCY_ROUTES = {
  request: '/emergency',
  requestAlias: '/emergency-diagnosis',
  tracking: '/emergency/tracking',
  rating: '/emergency/rating',
}

export const PROBLEM_TYPES = [
  { value: 'electricity', label: 'كهرباء' },
  { value: 'plumbing', label: 'سباكة' },
  { value: 'ac', label: 'تكييف وتبريد' },
  { value: 'appliances', label: 'أجهزة منزلية' },
  { value: 'other', label: 'عطل آخر' },
]

// Upload limits. Stated to the user in the dropzone hint rather than left to
// be discovered through a rejected file.
export const MEDIA_LIMITS = {
  maxFiles: 4,
  maxBytes: 10 * 1024 * 1024,
  accept: 'image/*,video/*',
}

// The three stages the tracking screen walks through. `key` is what the
// service reports; the copy lives here so the timeline and the live region
// announce the same words.
export const REQUEST_STAGES = [
  {
    key: 'received',
    title: 'تم استلام الطلب',
    detail: 'جارٍ إسناد الطلب إلى الفني.',
  },
  {
    key: 'enroute',
    title: 'الفني في الطريق',
    detail: 'يمكنك متابعة موعد الوصول المتوقع.',
  },
  {
    key: 'completed',
    title: 'اكتملت الخدمة',
    detail: 'بانتظار التأكيد النهائي.',
  },
]
