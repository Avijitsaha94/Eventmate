'use client'
import { getUser } from '@/utils/auth'
import ReviewsSection from '@/components/reviews/ReviewsSection'

export default function HostReviewsPage() {
  const user = getUser()
  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
      <ReviewsSection hostId={user._id} />
    </div>
  )
}