import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react'

function Settings() {
  const [formData, setFormData] = useState({
    name: 'أحمد حمدي',
    email: 'admin@ammarha.com',
    phone: '01012345678',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [notifications, setNotifications] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()

    console.log('Account data:', formData)
    console.log('Password data:', passwordData)
    console.log('Notifications:', notifications)

    // هنا بعدين نربط الـ API
  }

  return (
    <div dir="rtl" className="space-y-[24px]">

      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-text-500">
          إعدادات الحساب
        </h1>

        <p className="mt-[8px] text-[15px] text-text-300">
          إدارة بيانات حساب الأدمن والإعدادات الشخصية
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-[20px]">

        {/* Personal Information */}
        <section className="rounded-[16px] border border-line bg-white p-[24px]">

          <div className="mb-[24px] flex items-center gap-[12px]">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-primary-50 text-primary-500">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-[18px] font-bold text-text-500">
                البيانات الشخصية
              </h2>

              <p className="mt-[4px] text-[13px] text-text-300">
                تعديل بيانات حسابك الأساسية
              </p>
            </div>
          </div>

          <div className="grid gap-[20px] md:grid-cols-2">

            {/* Name */}
            <div>
              <label className="mb-[8px] block text-[14px] font-medium text-text-500">
                الاسم
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-text-300"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-[10px] border border-line bg-white py-[12px] pr-[44px] pl-[14px] text-[14px] outline-none transition focus:border-primary-500"
                  placeholder="أدخل الاسم"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-[8px] block text-[14px] font-medium text-text-500">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-text-300"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-[10px] border border-line bg-white py-[12px] pr-[44px] pl-[14px] text-[14px] outline-none transition focus:border-primary-500"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-[8px] block text-[14px] font-medium text-text-500">
                رقم الهاتف
              </label>

              <div className="relative">
                <Phone
                  size={19}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-text-300"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-[10px] border border-line bg-white py-[12px] pr-[44px] pl-[14px] text-[14px] outline-none transition focus:border-primary-500"
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Password */}
        <section className="rounded-[16px] border border-line bg-white p-[24px]">

          <div className="mb-[24px] flex items-center gap-[12px]">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-primary-50 text-primary-500">
              <Lock size={21} />
            </div>

            <div>
              <h2 className="text-[18px] font-bold text-text-500">
                تغيير كلمة المرور
              </h2>

              <p className="mt-[4px] text-[13px] text-text-300">
                قم بتحديث كلمة المرور الخاصة بحسابك
              </p>
            </div>
          </div>

          <div className="grid gap-[20px] md:grid-cols-2">

            {/* Current Password */}
            <div>
              <label className="mb-[8px] block text-[14px] font-medium text-text-500">
                كلمة المرور الحالية
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-[10px] border border-line py-[12px] pr-[14px] pl-[44px] text-[14px] outline-none transition focus:border-primary-500"
                  placeholder="أدخل كلمة المرور الحالية"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((prev) => !prev)
                  }
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-300 hover:text-text-500"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-[8px] block text-[14px] font-medium text-text-500">
                كلمة المرور الجديدة
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-[10px] border border-line py-[12px] pr-[14px] pl-[44px] text-[14px] outline-none transition focus:border-primary-500"
                  placeholder="أدخل كلمة المرور الجديدة"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword((prev) => !prev)
                  }
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-300 hover:text-text-500"
                >
                  {showNewPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-[8px] block text-[14px] font-medium text-text-500">
                تأكيد كلمة المرور الجديدة
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-[10px] border border-line py-[12px] pr-[14px] pl-[44px] text-[14px] outline-none transition focus:border-primary-500"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-300 hover:text-text-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-[16px] border border-line bg-white p-[24px]">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-[12px]">

              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-primary-50 text-primary-500">
                <Bell size={21} />
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-text-500">
                  الإشعارات
                </h2>

                <p className="mt-[4px] text-[13px] text-text-300">
                  استلام إشعارات النظام
                </p>
              </div>

            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setNotifications((prev) => !prev)}
              className={`relative h-[24px] w-[44px] rounded-full transition ${
                notifications
                  ? 'bg-primary-500'
                  : 'bg-gray-300'
              }`}
              aria-label="تفعيل الإشعارات"
            >
              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition ${
                  notifications
                    ? 'right-[3px]'
                    : 'right-[23px]'
                }`}
              />
            </button>

          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-start gap-[12px]">

          <button
            type="submit"
            className="flex items-center gap-[8px] rounded-[10px] bg-primary-500 px-[22px] py-[12px] text-[14px] font-bold text-white transition hover:bg-primary-600"
          >
            <Save size={18} />
            حفظ التعديلات
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-[8px] rounded-[10px] border border-line bg-white px-[22px] py-[12px] text-[14px] font-medium text-text-400 transition hover:bg-card"
          >
            <X size={18} />
            إلغاء
          </button>

        </div>

      </form>
    </div>
  )
}

export default Settings