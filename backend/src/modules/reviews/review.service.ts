import Review from './review.model'
import Booking from '../bookings/booking.model'
import Event from '../events/event.model'

// Review দাও
export const createReviewService = async (
  reviewerId: string,
  eventId: string,
  rating: number,
  comment: string
) => {
  // Event আছে কিনা check করো
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')

  // Event completed কিনা check করো
  if (event.status !== 'completed') {
    throw new Error('You can only review completed events')
  }

  // Host নিজেকে review দিতে পারবে না
  if (String(event.hostId) === reviewerId) {
    throw new Error('You cannot review your own event')
  }

  // User এই event এ join করেছিল কিনা check করো
  const booking = await Booking.findOne({
    userId: reviewerId,
    eventId,
    status: 'confirmed',
  })
  if (!booking) {
    throw new Error('You must have attended this event to leave a review')
  }

  // Already review দিয়েছে কিনা check করো
  const existingReview = await Review.findOne({ reviewerId, eventId })
  if (existingReview) {
    throw new Error('You have already reviewed this event')
  }

  // Review তৈরি করো
  const review = await Review.create({
    reviewerId,
    hostId: event.hostId,
    eventId,
    rating,
    comment,
  })

  return review
}

// Host এর সব reviews আনো
export const getHostReviewsService = async (hostId: string) => {
  const reviews = await Review.find({ hostId })
    .populate('reviewerId', 'name avatar')
    .populate('eventId', 'title date')
    .sort({ createdAt: -1 })

  // Average rating calculate করো
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
  const averageRating =
    reviews.length > 0
      ? Math.round((totalRating / reviews.length) * 10) / 10
      : 0

  return { reviews, averageRating, totalReviews: reviews.length }
}

// Review delete করো (admin only)
export const deleteReviewService = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId)
  if (!review) throw new Error('Review not found')
  return review
}

// User এর review আছে কিনা check করো
export const checkUserReviewService = async (
  reviewerId: string,
  eventId: string
) => {
  const review = await Review.findOne({ reviewerId, eventId })
  return { hasReviewed: !!review, review }
}