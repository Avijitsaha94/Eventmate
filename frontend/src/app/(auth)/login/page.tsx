/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { saveAuth } from '@/utils/auth'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill all fields')
      return
    }
    try {
      setLoading(true)
      const res = await api.post('/api/auth/login', form)
      const { token, user } = res.data.data
      saveAuth(token, user)
      toast.success('Login successful!')
      if (user.role === 'admin') router.push('/dashboard/admin')
      else if (user.role === 'host') router.push('/dashboard/host')
      else router.push('/dashboard/user')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'user' | 'host' | 'admin') => {
    const credentials = {
      user: { email: 'demo.user@eventmate.com', password: 'demo1234' },
      host: { email: 'demo.host@eventmate.com', password: 'demo1234' },
      admin: { email: 'demo.admin@eventmate.com', password: 'demo1234' },
    }
    try {
      setLoading(true)
      const res = await api.post('/api/auth/login', credentials[role])
      const { token, user } = res.data.data
      saveAuth(token, user)
      toast.success(`Logged in as Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`)
      if (user.role === 'admin') router.push('/dashboard/admin')
      else if (user.role === 'host') router.push('/dashboard/host')
      else router.push('/dashboard/user')
    } catch (error: any) {
      toast.error('Demo login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Login to continue to EventMate
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="space-y-2 mt-5">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Quick demo access
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['user', 'host', 'admin'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoLogin(role)}
                disabled={loading}
                className="text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
              >
                {role === 'user' ? '👤' : role === 'host' ? '🎪' : '🛡️'}{' '}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
          className="flex items-center justify-center gap-3 w-full border border-gray-200 dark:border-gray-700 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
            <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/>
            <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"/>
            <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}