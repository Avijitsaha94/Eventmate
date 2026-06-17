/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { getUser, saveAuth } from '@/utils/auth'
import toast from 'react-hot-toast'
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function BecomeHostPage() {
  const router = useRouter()
  const user = getUser()
  const [loading, setLoading] = useState(false)

  const perks = [
    { icon: Calendar, title: 'Create Unlimited Events', desc: 'Host as many events as you want, free or ticketed.' },
    { icon: DollarSign, title: 'Earn Revenue', desc: 'Set a fee and get paid securely through SSLCommerz.' },
    { icon: Users, title: 'Build a Community', desc: 'Connect with people who share your interests.' },
    { icon: TrendingUp, title: 'Track Your Growth', desc: 'See revenue charts and participant analytics.' },
  ]

  const handleBecomeHost = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.role === 'host') {
      toast.success('You are already a host!')
      router.push('/dashboard/host')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/users/become-host')
      const updatedUser = { ...user, role: 'host' as const }
      const token = localStorage.getItem('token') || ''
      saveAuth(token, updatedUser)
      toast.success('Congratulations! You are now a host!')
      router.push('/dashboard/host')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to become host')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Become a Host
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-12">
          Share your passion. Organize events. Build a community. Earn money.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12 text-left">
          {perks.map((perk) => {
            const Icon = perk.icon
            return (
              <div
                key={perk.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{perk.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{perk.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Ready to start hosting?</h2>
          <p className="text-blue-100 mb-6">It&apos;s free and takes less than a minute.</p>
          <button
            onClick={handleBecomeHost}
            disabled={loading}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-blue-50 disabled:opacity-50 transition"
          >
            {loading ? 'Please wait...' : 'Become a Host Now'}
          </button>
        </div>
      </div>
    </div>
  )
}