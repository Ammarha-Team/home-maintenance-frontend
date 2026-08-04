import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

// Chrome for the signed-out pages (sign up, landing, marketing): site header,
// page content, site footer. Figma frames 1:456 / 1:564 / 1:648 / 1:778.
function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-cairo">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default PublicLayout
