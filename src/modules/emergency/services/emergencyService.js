// Local stand-in for the emergency API, in the same shape authService.js uses
// for the auth endpoints: async functions with realistic latency so the
// screens exercise their loading, empty and error states before a backend
// exists. Every value here is synthetic.
//
// Swapping in the real service means replacing the bodies; the signatures and
// returned shapes are what the screens depend on.

const TECHNICIANS = [
  {
    id: 't-1',
    name: 'أحمد العتيبي',
    title: 'فني كهرباء معتمد',
    experience: '10 سنوات خبرة',
    rating: 4.9,
    reviews: 120,
    jobs: '+16 عرض متقدم ناجح',
    comments: '+10 تعليقات',
    price: 150,
    etaMinutes: 30,
    distanceKm: 5.6,
    verified: true,
  },
  {
    id: 't-2',
    name: 'خالد الشمري',
    title: 'فني كهرباء وأنظمة ذكية',
    experience: '7 سنوات خبرة',
    rating: 4.8,
    reviews: 86,
    jobs: '+11 عرض متقدم ناجح',
    comments: '+8 تعليقات',
    price: 135,
    etaMinutes: 25,
    distanceKm: 4.2,
    verified: true,
  },
  {
    id: 't-3',
    name: 'سعود القحطاني',
    title: 'فني صيانة عامة',
    experience: '5 سنوات خبرة',
    rating: 4.7,
    reviews: 54,
    jobs: '+9 عرض متقدم ناجح',
    comments: '+6 تعليقات',
    price: 120,
    etaMinutes: 40,
    distanceKm: 7.1,
    verified: false,
  },
]

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/**
 * Technicians who can take the job now. The real endpoint will filter by
 * problem type and location; both are accepted here so the call sites are
 * already written against the final signature.
 */
export async function findAvailableTechnicians() {
  await wait(900)
  return TECHNICIANS
}

export async function submitEmergencyRequest(request) {
  await wait(700)
  return {
    id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'received',
    createdAt: new Date().toISOString(),
    ...request,
  }
}

export async function cancelEmergencyRequest() {
  await wait(500)
  return { status: 'cancelled' }
}

export async function submitEmergencyRating() {
  await wait(600)
  return { status: 'received' }
}

// Used when a tracking or rating screen is opened directly — a refresh, or a
// link pasted into a new tab — so the page has something coherent to render
// instead of failing on missing router state.
export const FALLBACK_TECHNICIAN = TECHNICIANS[0]
