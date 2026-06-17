/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import StarRating from './StarRating'

interface ReviewFormProps {
  eventId: string
  hostId: string
  onSuccess: () => void
}

export default function ReviewForm({ eventId, hostId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (comment.trim().length < 5) {
      toast.error('Please write a short comment')
      return
    }

    try {
      setLoading(true)
      await api.post('/api/reviews', { eventId, hostId, rating, comment })
      toast.success('Review submitted!')
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Leave a Review</h3>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Rating</p>
        <StarRating rating={rating} onChange={setRating} size={28} />
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Comment</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Share your experience..."
          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">{comment.length}/500</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}