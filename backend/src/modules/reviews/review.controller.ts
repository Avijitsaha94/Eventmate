import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import {
  createReviewService,
  getHostReviewsService,
  deleteReviewService,
  checkUserReviewService,
} from './review.service'

// Review দাও
export const createReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { eventId, rating, comment } = req.body

    if (!eventId || !rating || !comment) {
      res.status(400).json({
        success: false,
        message: 'Event ID, rating and comment are required',
      })
      return
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      })
      return
    }

    const review = await createReviewService(
      req.user!._id,
      eventId,
      rating,
      comment
    )
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Host এর reviews
export const getHostReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getHostReviewsService(req.params.hostId)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Review delete
export const deleteReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    await deleteReviewService(req.params.id)
    res.status(200).json({ success: true, message: 'Review deleted' })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// User এর review check
export const checkUserReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await checkUserReviewService(
      req.user!._id,
      req.params.eventId
    )
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}