import { Router } from 'express'
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getHostEvents,
  getFeaturedEvents,
} from './event.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'

const router = Router()

// Public routes
router.get('/', getAllEvents)
router.get('/featured', getFeaturedEvents)
router.get('/host/:hostId', getHostEvents)
router.get('/:id', getEventById)

// Protected routes
router.post('/', protect, allowTo('host', 'admin'), createEvent)
router.patch('/:id', protect, allowTo('host', 'admin'), updateEvent)
router.delete('/:id', protect, allowTo('host', 'admin'), deleteEvent)
router.patch('/:id/status', protect, allowTo('host', 'admin'), updateEventStatus)

export default router