/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { getUser, saveAuth } from '@/utils/auth'
import toast from 'react-hot-toast'

const INTERESTS = [
  'Music', 'Sports', 'Gaming', 'Food', 'Travel',
  'Tech', 'Art', 'Hiking', 'Photography', 'Reading',
]

export default function UserSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    interests: [] as string[],
  })

  useEffect(() => {
    const user = getUser()
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: user.name || '',
        bio: (user as any).bio || '',
        location: (user as any).location || '',
        interests: (user as any).interests || [],
      })
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      setUploading(true)
      const res = await api.post('/api/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Avatar updated!')
      const user = getUser()
      if (user) {
        const token = localStorage.getItem('token') || ''
        saveAuth(token, { ...user, avatar: res.data.data.avatarUrl })
      }
    } catch (error: any) {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.patch('/api/users/profile', form)
      const user = getUser()
      if (user) {
        const token = localStorage.getItem('token') || ''
        saveAuth(token, { ...user, ...res.data.data })
      }
      toast.success('Profile updated!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>

      {/* Avatar Upload */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 overflow-hidden">
            {getUser()?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5MB</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Personal Info</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            placeholder="e.g. Dhaka, Bangladesh"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange}
            rows={3} maxLength={300} placeholder="Tell others about yourself..."
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          <p className="text-xs text-gray-400 text-right">{form.bio.length}/300</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  form.interests.includes(interest)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}