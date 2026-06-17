'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/utils/auth'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push('/login')
      return
    }
    if (user.role === 'admin') router.push('/dashboard/admin')
    else if (user.role === 'host') router.push('/dashboard/host')
    else router.push('/dashboard/user')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
}