// Stand-in data for the admin console. The console is being built against the
// design before the admin endpoints exist, so every figure here comes from the
// frame rather than from the API. Swapping these for real calls should not need
// the screens to change: each export is already shaped the way the screens read
// it.

/**
 * The eight tiles across the top of the dashboard, in the order the frame draws
 * them (right to left, two rows of four).
 *
 * `delta` is the change against the previous period and `trend` says which way
 * to point the arrow — kept apart from the number itself so a fall in a figure
 * that is good when it falls can still be coloured by hand.
 */
export const DASHBOARD_STATS = [
  { key: 'customers', label: 'إجمالي العملاء', value: '15,420', delta: '12%', trend: 'up', tone: 'primary' },
  { key: 'technicians', label: 'إجمالي الفنيين', value: '1,245', delta: '5%', trend: 'up', tone: 'primary' },
  { key: 'newOrders', label: 'الطلبات الجديدة اليوم', value: '342', delta: '24%', trend: 'up', tone: 'success' },
  { key: 'openOrders', label: 'الطلبات قيد التنفيذ', value: '128', delta: '2%', trend: 'down', tone: 'primary' },
  { key: 'doneOrders', label: 'الطلبات المكتملة', value: '45,210', delta: '8%', trend: 'up', tone: 'success' },
  { key: 'revenue', label: 'الإيرادات الشهرية', value: '324K', unit: 'ج.م', delta: '15%', trend: 'up', tone: 'primary' },
  { key: 'commission', label: 'العمولات المستحقة', value: '12.5K', unit: 'ج.م', delta: '3%', trend: 'down', tone: 'error' },
  { key: 'satisfaction', label: 'نسبة رضا العملاء', value: '96%', delta: '1.2%', trend: 'up', tone: 'primary' },
]

/**
 * The ranges the chart dropdown offers. Only six months is drawn in the frame;
 * twelve extends the same shape backwards so the dropdown has somewhere to go.
 */
export const REVENUE_RANGES = [
  { key: '6m', label: 'آخر 6 أشهر' },
  { key: '12m', label: 'آخر 12 شهر' },
]

const REVENUE_SERIES = {
  '6m': [
    { month: 'يناير', value: 150000 },
    { month: 'فبراير', value: 180000 },
    { month: 'مارس', value: 208000 },
    { month: 'أبريل', value: 190000 },
    { month: 'مايو', value: 250000 },
    { month: 'يونيو', value: 324000 },
  ],
  '12m': [
    { month: 'يوليو', value: 96000 },
    { month: 'أغسطس', value: 112000 },
    { month: 'سبتمبر', value: 104000 },
    { month: 'أكتوبر', value: 138000 },
    { month: 'نوفمبر', value: 129000 },
    { month: 'ديسمبر', value: 161000 },
    { month: 'يناير', value: 150000 },
    { month: 'فبراير', value: 180000 },
    { month: 'مارس', value: 208000 },
    { month: 'أبريل', value: 190000 },
    { month: 'مايو', value: 250000 },
    { month: 'يونيو', value: 324000 },
  ],
}

/** The series behind the chart. Falls back to six months for an unknown range. */
export const revenueSeries = (range) => REVENUE_SERIES[range] ?? REVENUE_SERIES['6m']

/**
 * The three notes beside the chart. The last one is a warning rather than an
 * observation, which is why tone travels with the note instead of being decided
 * by its position in the list.
 */
export const BUSINESS_INSIGHTS = [
  {
    key: 'growth',
    title: 'نمو قوي في الطلبات',
    body: 'ارتفعت الطلبات بنسبة 18٪ هذا الأسبوع مقارنة بالأسبوع الماضي.',
    tone: 'primary',
  },
  {
    key: 'quality',
    title: 'تحسن جودة الخدمة',
    body: 'ارتفع متوسط تقييم الفنيين إلى 4.8 من أصل 5 نقاط.',
    tone: 'primary',
  },
  {
    key: 'dues',
    title: 'تنبيه مستحقات',
    body: 'يوجد 12 فنيًا لم يسددوا العمولة الأسبوعية المتأخرة.',
    tone: 'error',
  },
]

export const TECHNICIAN_CITIES = ['الرياض', 'جدة', 'الدمام', 'مكة']
export const TECHNICIAN_SPECIALTIES = ['كهرباء', 'سباكة', 'تكييف', 'نجارة']

export const TECHNICIAN_STATUSES = [
  { key: 'active', label: 'نشط' },
  { key: 'suspended', label: 'موقوف' },
]

/** The label a status pill shows, so the table never prints a raw key. */
export const technicianStatusLabel = (status) =>
  TECHNICIAN_STATUSES.find((item) => item.key === status)?.label ?? status

// The technicians the frame draws, alternating down the table. Fifty rows are
// generated from them so the pagination has real pages to move through rather
// than one short list.
const TECHNICIAN_SEED = [
  {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    city: 'الرياض',
    specialty: 'كهرباء',
    experienceYears: 5,
    rating: 4.8,
    orders: 120,
    status: 'active',
  },
  {
    name: 'محمود علي',
    email: 'mahmoud@example.com',
    phone: '0559876543',
    city: 'جدة',
    specialty: 'سباكة',
    experienceYears: 8,
    rating: 4.6,
    orders: 85,
    status: 'suspended',
  },
  {
    name: 'خالد سعيد',
    email: 'khaled@example.com',
    phone: '0532223344',
    city: 'الدمام',
    specialty: 'تكييف',
    experienceYears: 3,
    rating: 4.9,
    orders: 64,
    status: 'active',
  },
  {
    name: 'ياسر إبراهيم',
    email: 'yasser@example.com',
    phone: '0547778899',
    city: 'مكة',
    specialty: 'نجارة',
    experienceYears: 11,
    rating: 4.4,
    orders: 203,
    status: 'active',
  },
]

export const TECHNICIANS = Array.from({ length: 50 }, (_, index) => {
  const seed = TECHNICIAN_SEED[index % TECHNICIAN_SEED.length]
  return { ...seed, id: `TECH-${String(index + 1).padStart(3, '0')}` }
})

/**
 * The table's filter. Every filter is optional and an empty value means "all",
 * which is what the three selects start on.
 */
export const filterTechnicians = (technicians, { city, specialty, status }) =>
  technicians.filter(
    (technician) =>
      (!city || technician.city === city) &&
      (!specialty || technician.specialty === specialty) &&
      (!status || technician.status === status),
  )

/** How many rows one page of the technicians table holds. */
export const TECHNICIANS_PAGE_SIZE = 10
