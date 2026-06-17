/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/axios'
import { getUser } from '@/utils/auth'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'

interface ReviewsSectionProps {
  hostId: string
  eventId: string
  eventStatus: string
}

export default function ReviewsSection({ hostId, eventId, eventStatus }: ReviewsSectionProps) {
  const user = getUser()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [canReview, setCanReview] = useState(false)

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/api/reviews/host/${hostId}`)
      setData(res.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [hostId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    const checkReview = async () => {
      if (!user) return
      try {
        const res = await api.get(`/api/reviews/check/${eventId}`)
        setHasReviewed(res.data.data.hasReviewed)

        const bookingsRes = await api.get('/api/bookings/my')
        const attended = bookingsRes.data.data.some(
          (b: any) => String(b.eventId._id) === String(eventId) && b.status === 'confirmed'
        )
        setCanReview(attended && eventStatus === 'completed' && user._id !== hostId)
      } catch {}
    }
    checkReview()
  }, [eventId, eventStatus, hostId])

  if (loading) {
    return <div className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">{data?.averageRating || 0}</div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{data?.totalReviews || 0} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = data?.reviews?.filter((r: any) => r.rating === star).length || 0
            const pct = data?.totalReviews ? (count / data.totalReviews) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-4">{star}</span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {canReview && !hasReviewed && (
        <ReviewForm
          eventId={eventId}
          hostId={hostId}
          onSuccess={() => {
            setHasReviewed(true)
            fetchReviews()
          }}
        />
      )}

      {hasReviewed && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 text-center text-green-700 dark:text-green-400 text-sm font-medium">
          ✅ You&apos;ve already reviewed this event
        </div>
      )}

      <div className="space-y-3">
        {data?.reviews?.length === 0 ? (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">No reviews yet</div>
        ) : (
          data?.reviews?.map((review: any) => <ReviewCard key={review._id} review={review} />)
        )}
      </div>
    </div>
  )
}