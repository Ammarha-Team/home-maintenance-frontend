// Arabic for the trades the API returns. GET /api/Profession/GetAll answers
// with English names — Plumber, Electrician, Carpenter — and the app is Arabic,
// so the label shown comes from here while the option's value stays the
// profession id the register endpoint wants. A trade missing from this map
// falls back to the server's own name rather than dropping out of the list.
export const PROFESSION_LABELS_AR = {
  Plumber: 'فني سباكة',
  Electrician: 'فني كهرباء',
  Carpenter: 'فني نجارة',
}

// Options for the technician-only fields on sign up step 2 (Figma node 1:648).
// The frame only shows the selected sample ("فني تكييفات"), so the rest of the
// list is a placeholder until the trades come from the API.
export const SPECIALISATIONS = [
  { value: 'air-conditioning', label: 'فني تكييفات' },
  { value: 'electrical', label: 'فني كهرباء' },
  { value: 'plumbing', label: 'فني سباكة' },
  { value: 'carpentry', label: 'فني نجارة' },
  { value: 'appliances', label: 'فني أجهزة منزلية' },
]
