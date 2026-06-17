import { Router } from 'express'
import {
  joinEvent,
  leaveEvent,
  getMyBookings,
  getEventParticipants,
} from './booking.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'
import { RequestHandler } from 'express'


const router = Router()

router.get('/my', protect, getMyBookings as RequestHandler)
router.get('/:eventId/participants', protect, allowTo('host', 'admin'), getEventParticipants as RequestHandler)
router.post('/:id/join', protect, allowTo('user'), joinEvent as RequestHandler)
router.post('/:id/leave', protect, leaveEvent as RequestHandler)

export default router