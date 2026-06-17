import { IUser } from '@/types'

export const saveAuth = (token: string, user: IUser) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  // Cookie set করো middleware এর জন্য
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const getUser = (): IUser | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const removeAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  document.cookie = 'token=; path=/; max-age=0'
}

export const isLoggedIn = (): boolean => {
  return !!getToken()
}