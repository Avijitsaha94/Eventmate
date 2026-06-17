'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { saveAuth } from '@/utils/auth'
import { IUser } from '@/types'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    const role = searchParams.get('role')
    const avatar = searchParams.get('avatar')

    if (token && userId && name && role) {
      const user: IUser = {
        _id: userId,
        name: decodeURIComponent(name),
        email: '',
        role: role as IUser['role'],
        avatar: decodeURIComponent(avatar || ''),
      }
      saveAuth(token, user)

      if (role === 'admin') router.push('/dashboard/admin')
      else if (role === 'host') router.push('/dashboard/host')
      else router.push('/dashboard/user')
    } else {
      router.push('/login?error=auth_failed')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <CallbackContent />
    </Suspense>
  )
}