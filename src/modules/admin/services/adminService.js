// What the admin console draws that the backend has no answer for.
//
// The rosters and the dashboard figures now come from the API — those calls
// live in `adminApi.js`. What is left here is the part of the console the
// backend does not publish yet: the revenue series, the business notes, the
// profit periods, and the vocabulary the tables share (page sizes, status
// labels, the filters they run on the client).
//
// The written-down city and profession lists stay as the fallback the filter
// components fall back to; the screens hand them the values the API actually
// returned.

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

export const CUSTOMER_CITIES = ['الرياض', 'جدة', 'الدمام', 'مكة']

export const CUSTOMER_STATUSES = [
  { key: 'active', label: 'نشط' },
  { key: 'banned', label: 'محظور' },
]

/** The label a status pill shows, so the table never prints a raw key. */
export const customerStatusLabel = (status) =>
  CUSTOMER_STATUSES.find((item) => item.key === status)?.label ?? status

/**
 * The customers table's filter. Every filter is optional and an empty value
 * means "all", which is what the toolbar starts on.
 *
 * The search runs across the four fields a reader can actually see in the row,
 * so typing a city or an id finds the same row as typing the name.
 */
export const filterCustomers = (customers, { search, city, status }) => {
  const needle = search.trim().toLowerCase()

  // A field the API left empty is searched as an empty string rather than
  // reaching for `toLowerCase` on a null and taking the table down with it.
  const text = (value) => String(value ?? '').toLowerCase()

  return customers.filter((customer) => {
    const matchesSearch =
      !needle ||
      text(customer.name).includes(needle) ||
      text(customer.city).includes(needle) ||
      text(customer.email).includes(needle) ||
      text(customer.id).includes(needle)

    return (
      matchesSearch && (!city || customer.city === city) && (!status || customer.status === status)
    )
  })
}

/** How many rows one page of the customers table holds. */
export const CUSTOMERS_PAGE_SIZE = 10

/**
 * The ranges the profits screen offers. The frame draws "هذا الشهر" selected;
 * the rest carry their own figures so the row of tiles answers the choice
 * rather than sitting still.
 */
export const PROFIT_PERIODS = [
  { key: 'today', label: 'اليوم' },
  { key: 'week', label: 'هذا الأسبوع' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'quarter', label: 'آخر 3 أشهر' },
  { key: 'year', label: 'هذا العام' },
]

/**
 * The three figures across the top of the profits screen. These read the
 * platform as a whole and do not follow the period tabs below them, which is
 * why they sit apart from the tiles that do.
 */
export const PROFIT_SUMMARY = [
  {
    key: 'monthlyRevenue',
    label: 'الإيرادات الشهرية',
    value: '45,200',
    unit: 'ج.م',
    delta: '+12.5%',
    caption: 'عن الشهر الماضي',
    trend: 'up',
  },
  {
    key: 'weeklyRevenue',
    label: 'الإيرادات الأسبوعية',
    value: '12,450',
    unit: 'ج.م',
    delta: '+3.2%',
    caption: 'عن الأسبوع الماضي',
    trend: 'up',
  },
  {
    key: 'netProfit',
    label: 'صافي الأرباح',
    value: '18,300',
    unit: 'ج.م',
    delta: '-1.5%',
    caption: 'عن الشهر الماضي',
    trend: 'down',
  },
]

/**
 * The three notes under the summary. The last is a warning rather than an
 * observation and the middle one is neither, so tone travels with the note
 * instead of being decided by its position in the row.
 */
export const PROFIT_INSIGHTS = [
  {
    key: 'growth',
    title: 'أداء قوي للإيرادات',
    body: 'ارتفعت الإيرادات بنسبة 22% مقارنة بالشهر الماضي. خدمات "التكييف" هي الأكثر مساهمة.',
    tone: 'highlight',
  },
  {
    key: 'geography',
    title: 'أعلى إيرادات جغرافية',
    body: 'مدينة الرياض سجلت أعلى الإيرادات بنسبة 45% من إجمالي الدخل لهذا الشهر.',
    tone: 'neutral',
  },
  {
    key: 'alert',
    title: 'تنبيه بالنظام',
    body: 'وجود عمولات متأخرة لـ 6 فنيين تتجاوز قيمتها 15,000 ج.م. يرجى المتابعة.',
    tone: 'error',
  },
]

// The five tiles under the tabs, one set per period. Only "هذا الشهر" is drawn
// in the frame; the other four carry figures of their own so the tabs move
// something when they are pressed.
const PROFIT_METRICS = {
  today: [
    { key: 'revenue', label: 'إجمالي الإيرادات', value: '14,800', delta: '4.1%', trend: 'up' },
    { key: 'platform', label: 'إجمالي أرباح المنصة', value: '2,150', delta: '2.8%', trend: 'up' },
    { key: 'technicians', label: 'إجمالي أرباح الفنيين', value: '12,650', delta: '4.6%', trend: 'up' },
    { key: 'collected', label: 'العمولات المحصلة', value: '1,900', delta: '1.9%', trend: 'up' },
    { key: 'due', label: 'العمولات المستحقة', value: '250', delta: '0.0%', trend: 'flat' },
  ],
  week: [
    { key: 'revenue', label: 'إجمالي الإيرادات', value: '103,600', delta: '6.7%', trend: 'up' },
    { key: 'platform', label: 'إجمالي أرباح المنصة', value: '15,040', delta: '5.2%', trend: 'up' },
    { key: 'technicians', label: 'إجمالي أرباح الفنيين', value: '88,560', delta: '7.1%', trend: 'up' },
    { key: 'collected', label: 'العمولات المحصلة', value: '13,380', delta: '3.4%', trend: 'up' },
    { key: 'due', label: 'العمولات المستحقة', value: '1,660', delta: '1.2%', trend: 'down' },
  ],
  month: [
    { key: 'revenue', label: 'إجمالي الإيرادات', value: '450,200', delta: '12.5%', trend: 'up' },
    { key: 'platform', label: 'إجمالي أرباح المنصة', value: '65,400', delta: '8.2%', trend: 'up' },
    { key: 'technicians', label: 'إجمالي أرباح الفنيين', value: '384,800', delta: '14.1%', trend: 'up' },
    { key: 'collected', label: 'العمولات المحصلة', value: '58,200', delta: '5.4%', trend: 'up' },
    { key: 'due', label: 'العمولات المستحقة', value: '7,200', delta: '0.0%', trend: 'flat' },
  ],
  quarter: [
    { key: 'revenue', label: 'إجمالي الإيرادات', value: '1,286,400', delta: '9.8%', trend: 'up' },
    { key: 'platform', label: 'إجمالي أرباح المنصة', value: '186,900', delta: '7.3%', trend: 'up' },
    { key: 'technicians', label: 'إجمالي أرباح الفنيين', value: '1,099,500', delta: '10.4%', trend: 'up' },
    { key: 'collected', label: 'العمولات المحصلة', value: '164,700', delta: '6.1%', trend: 'up' },
    { key: 'due', label: 'العمولات المستحقة', value: '22,200', delta: '2.5%', trend: 'down' },
  ],
  year: [
    { key: 'revenue', label: 'إجمالي الإيرادات', value: '4,915,300', delta: '18.6%', trend: 'up' },
    { key: 'platform', label: 'إجمالي أرباح المنصة', value: '714,200', delta: '15.9%', trend: 'up' },
    { key: 'technicians', label: 'إجمالي أرباح الفنيين', value: '4,201,100', delta: '19.4%', trend: 'up' },
    { key: 'collected', label: 'العمولات المحصلة', value: '638,400', delta: '12.7%', trend: 'up' },
    { key: 'due', label: 'العمولات المستحقة', value: '75,800', delta: '3.8%', trend: 'down' },
  ],
}

/** The tiles behind the tabs. Falls back to the month the frame draws. */
export const profitMetrics = (period) => PROFIT_METRICS[period] ?? PROFIT_METRICS.month
