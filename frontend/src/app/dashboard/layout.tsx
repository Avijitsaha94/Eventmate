'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, removeAuth } from '@/utils/auth'
import { IUser } from '@/types'
import { Tag, BarChart3 } from 'lucide-react'
import {
  LayoutDashboard,
  Calendar,
  Star,
  LogOut,
  Menu,
  X,
  Users,
  Settings,
  PlusCircle,
  CreditCard,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<IUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/login')
      return
    }
    setUser(u)
  }, [router])

  const handleLogout = () => {
    removeAuth()
    router.push('/')
  }

  // Role অনুযায়ী menu items
  const getMenuItems = () => {
    if (!user) return []

   if (user.role === 'admin') {
  return [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Manage Events', href: '/dashboard/admin/events', icon: Calendar },
    { label: 'Categories', href: '/dashboard/admin/categories', icon: Tag },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { label: 'Manage Reviews', href: '/dashboard/admin/reviews', icon: Star },
  ]
}

    if (user.role === 'host') {
      return [
        { label: 'Overview', href: '/dashboard/host', icon: LayoutDashboard },
        { label: 'My Events', href: '/dashboard/host/events', icon: Calendar },
        { label: 'Create Event', href: '/events/create', icon: PlusCircle },
        { label: 'Revenue', href: '/dashboard/host/revenue', icon: CreditCard },
        { label: 'Reviews', href: '/dashboard/host/reviews', icon: Star },
      ]
    }

    return [
      { label: 'Overview', href: '/dashboard/user', icon: LayoutDashboard },
      { label: 'My Events', href: '/dashboard/user/events', icon: Calendar },
      { label: 'Payments', href: '/dashboard/user/payments', icon: CreditCard },
      { label: 'Settings', href: '/dashboard/user/settings', icon: Settings },
    ]
  }

  const menuItems = getMenuItems()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-30 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-blue-600">
              EventMate
            </Link>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="font-bold text-blue-600">EventMate</span>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}