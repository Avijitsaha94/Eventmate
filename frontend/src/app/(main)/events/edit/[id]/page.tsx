/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { ImagePlus, X } from 'lucide-react'

const EVENT_TYPES = [
  'Concert', 'Hiking', 'Food', 'Gaming',
  'Sports', 'Tech', 'Art', 'Travel', 'Other',
]

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    type: 'Concert',
    description: '',
    date: '',
    location: '',
    minParticipants: 2,
    maxParticipants: 10,
    fee: 0,
    image: '',
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`)
        const event = res.data.data
        setForm({
          title: event.title,
          type: event.type,
          description: event.description,
          date: new Date(event.date).toISOString().slice(0, 16),
          location: event.location,
          minParticipants: event.minParticipants,
          maxParticipants: event.maxParticipants,
          fee: event.fee,
          image: event.image || '',
        })
        setImagePreview(event.image || null)
      } catch (error) {
        toast.error('Failed to load event')
      } finally {
        setFetching(false)
      }
    }
    if (id) fetchEvent()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('image', file)

    try {
      setImageUploading(true)
      const res = await api.post('/api/events/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm((prev) => ({ ...prev, image: res.data.data.imageUrl }))
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setForm((prev) => ({ ...prev, image: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.date || !form.location) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      await api.patch(`/api/events/${id}`, form)
      toast.success('Event updated successfully!')
      router.push('/dashboard/host')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Edit Event</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Event Banner Image
          </label>
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden h-48">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              {imageUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!imageUploading && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <ImagePlus size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">Click to upload image</p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Event Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Event Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date & Time *</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Min Participants</label>
            <input
              type="number"
              name="minParticipants"
              value={form.minParticipants}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fee (৳)</label>
            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  )
}