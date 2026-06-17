import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}