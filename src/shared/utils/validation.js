// Shared field validators. Each returns an Arabic error message, or '' when the
// value is valid, so callers can drop the result straight into an errors map.

const EGYPT_LOCAL_PHONE = /^1[0125]\d{8}$/

export const validatePhone = (value) => {
  const digits = value.trim()

  if (!digits) return 'رقم الهاتف مطلوب'
  if (!/^\d+$/.test(digits)) return 'يجب أن يحتوي رقم الهاتف على أرقام فقط'
  if (!EGYPT_LOCAL_PHONE.test(digits)) return 'رقم الهاتف غير صحيح'

  return ''
}

// Deliberately permissive: one @, something either side, a dot in the domain.
// Anything stricter rejects valid addresses, and the server is the real check.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateEmail = (value) => {
  const email = value.trim()

  if (!email) return 'الايميل الالكتروني مطلوب'
  if (!EMAIL.test(email)) return 'الايميل الالكتروني غير صحيح'

  return ''
}

export const validateFullName = (value) => {
  const name = value.trim()

  if (!name) return 'الاسم بالكامل مطلوب'
  if (name.length < 3) return 'الاسم قصير جدًا'
  if (name.split(/\s+/).length < 2) return 'يرجى إدخال الاسم بالكامل'

  return ''
}

export const validateConfirmPassword = (value, password) => {
  if (!value) return 'تأكيد كلمة السر مطلوب'
  if (value !== password) return 'كلمتا السر غير متطابقتين'

  return ''
}

export const validatePassword = (value) => {
  if (!value) return 'كلمة السر مطلوبة'
  if (value.length < 8) return 'كلمة السر يجب ألا تقل عن 8 أحرف'

  return ''
}

// Technician-only fields (Figma nodes 1:719 / 1:726).
export const validateSpecialisation = (value) => {
  if (!value) return 'التخصص مطلوب'

  return ''
}

export const MAX_EXPERIENCE_YEARS = 60

export const validateExperience = (value) => {
  const years = String(value).trim()

  if (!years) return 'سنوات الخبرة مطلوبة'
  if (!/^\d+$/.test(years)) return 'يجب أن تحتوي سنوات الخبرة على أرقام فقط'
  if (Number(years) > MAX_EXPERIENCE_YEARS) return 'سنوات الخبرة غير صحيحة'

  return ''
}
