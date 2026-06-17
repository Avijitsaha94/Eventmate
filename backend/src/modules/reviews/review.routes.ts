import { Router } from 'express'
import {
  createReview,
  getHostReviews,
  deleteReview,
  checkUserReview,
} from './review.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'
import { RequestHandler } from 'express'

const router = Router()

// Public
router.get('/host/:hostId', getHostReviews)

// Protected
router.post('/', protect, allowTo('user'), createReview as RequestHandler)
router.get('/check/:eventId', protect, checkUserReview as RequestHandler)
router.delete('/:id', protect, allowTo('admin'), deleteReview as RequestHandler)

export default router