/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { format } from 'date-fns'
import StarRating from '@/components/reviews/StarRating'
import toast from 'react-hot-toast'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllReviews = async () => {
    try {
      const usersRes = await api.get('/api/users')
      const hosts = usersRes.data.data.filter((u: any) => u.role === 'host')
      const allReviews: any[] = []
      for (const host of hosts) {
        try {
          const res = await api.get(`/api/reviews/host/${host._id}`)
          allReviews.push(...res.data.data.reviews)
        } catch {}
      }
      setReviews(allReviews.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllReviews()
  }, [])

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return
    try {
      await api.delete(`/api/reviews/${reviewId}`)
      setReviews((prev) => prev.filter((r) => r._id !== reviewId))
      toast.success('Review deleted')
    } catch (error: any) {
      toast.error('Failed to delete review')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          All Reviews ({reviews.length})
        </h1>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">⭐</p>
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {review.reviewerId?.name}
                  </span>
                  <span className="text-gray-400 text-xs">→</span>
                  <span className="text-sm text-gray-600">
                    {review.hostId?.name || 'Host'}
                  </span>
                  <StarRating rating={review.rating} readonly size={13} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                  {review.comment}
                </p>
                <p className="text-xs text-gray-400">
                  {review.eventId?.title} •{' '}
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}