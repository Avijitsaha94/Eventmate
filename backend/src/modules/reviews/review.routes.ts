import { Router } from 'express'
import {
  createReview,
  getHostReviews,
  deleteReview,
  checkUserReview,
} from './review.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'

const router = Router()

// Public
router.get('/host/:hostId', getHostReviews)

// Protected
router.post('/', protect, allowTo('user'), createReview)
router.get('/check/:eventId', protect, checkUserReview)
router.delete('/:id', protect, allowTo('admin'), deleteReview)

export default router