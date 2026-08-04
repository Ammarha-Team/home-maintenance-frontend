import AuthLayout from '../components/AuthLayout.jsx'
import LoginForm from '../components/LoginForm.jsx'

// Figma: "تسجيل دخول" (node 1:381)
function Login() {
  return (
    <AuthLayout
      title="تسجيل دخول"
      subtitle="ابدأ رحلتك نحو منزل أكثر أمانًا وتنظيمًا."
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default Login
