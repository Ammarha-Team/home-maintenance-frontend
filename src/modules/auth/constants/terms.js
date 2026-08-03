// Clause copy for the consent screens, transcribed from Figma.
// Customer terms: node 1:602 (bullets 1:603 – 1:608), in frame order.
export const CUSTOMER_TERMS = [
  'تقديم بيانات صحيحة عند إنشاء الحساب.',
  'يمكن تعديل موعد الحجز مرة واحدة مجانًا حسب توفر الفنيين',
  'تحتفظ المنصة بحق تحديث الشروط مع إشعار المستخدمين.',
  'الالتزام بشروط وأحكام المنصة عند استخدام الخدمة.',
  'إلغاء الحجز مجانًا قبل الموعد بـ 24 ساعة على الأقل.',
  'قد تُطبق رسوم إدارية 15% عند الإلغاء المتأخر.',
]

// Shown next to the consent checkbox on both terms screens (node 1:611).
export const CONSENT_LABEL =
  'لقد قرأت كافة البنود المذكورة أعلاه وأوافق على الالتزام الكامل بها .'

// Joining agreement badge copy (node 6:1725) — display text, not a parsed date.
export const TERMS_UPDATED_LABEL = 'تحديث: يوليو 2026'

// Technician joining agreement (node 6:1729). Each clause is its own card with
// a mark; `tone` picks the chip colours — 'danger' for the penalties clause.
export const TECHNICIAN_TERMS = [
  {
    id: 'data-validity',
    title: 'صحة البيانات',
    body: 'يقر الفني بأن جميع المعلومات المقدمة (الهوية ,الشهادات المهنية، الخبرات) صحيحة وحديثة. أي تلاعب في البيانات يعرض الحساب للإغلاق الفوري والمساءلة القانونية.',
    icon: 'data',
  },
  {
    id: 'service-quality',
    title: 'جودة الخدمة',
    body: 'الالتزام بأعلى معايير المهنية، المظهر اللائق، والتعامل الراقي مع العملاء. يتعهد الفني باستخدام أدوات ومواد مطابقة للمواصفات الفنية المطلوبة.',
    icon: 'quality',
  },
  {
    id: 'warranty',
    title: 'الضمان',
    body: 'يلتزم الفني بتقديم ضمان بحد أدنى 14 يوماً على كافة الأعمال المنفذة. في حال ظهور العيب مرة أخرى، يلتزم الفني بالإصلاح مجاناً خلال مدة الضمان.',
    icon: 'warranty',
  },
  {
    id: 'penalties',
    title: 'المخالفات والجزاءات',
    body: 'إجراء صفقات خارج المنصة، التأخير المتكرر، أو الشكاوى المثبتة من العملاء تؤدي لتطبيق غرامات مالية أو تعليق الحساب مؤقتاً أو نهائياً.',
    icon: 'penalties',
    tone: 'danger',
  },
]
