'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getUser, removeAuth } from '@/utils/auth'
import { IUser } from '@/types'
import ThemeToggle from './ThemeToggle'
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setUser(getUser())
  }, [pathname])

  const handleLogout = () => {
    removeAuth()
    setUser(null)
    router.push('/')
  }

  // Role অনুযায়ী nav links
  const getNavLinks = () => {
  if (!user) {
    return [
      { label: 'Explore Events', href: '/events' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Become a Host', href: '/become-host' },
    ]
  }
  if (user.role === 'admin') {
    return [
      { label: 'Explore Events', href: '/events' },
      { label: 'About', href: '/about' },
      { label: 'Dashboard', href: '/dashboard/admin' },
    ]
  }
  if (user.role === 'host') {
    return [
      { label: 'Explore Events', href: '/events' },
      { label: 'About', href: '/about' },
      { label: 'My Events', href: '/dashboard/host' },
      { label: 'Create Event', href: '/events/create' },
    ]
  }
  return [
    { label: 'Explore Events', href: '/events' },
    { label: 'About', href: '/about' },
    { label: 'My Events', href: '/dashboard/user' },
  ]
}

  const navLinks = getNavLinks()

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
       <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          EventMate
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
             <ThemeToggle />
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-20 overflow-hidden">
                    <Link
                      href={`/profile/${user._id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <div className="border-t" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full transition"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
      
<div className="flex items-center gap-2 md:hidden">
  <ThemeToggle />
  <button onClick={() => setMobileOpen(!mobileOpen)}>
    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
  </button>
</div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t pt-3 space-y-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-medium text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/profile/${user._id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    handleLogout()
                  }}
                  className="block w-full text-left py-2 text-sm text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}