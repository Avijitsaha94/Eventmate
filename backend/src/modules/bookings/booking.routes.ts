import { Router } from 'express'
import {
  joinEvent,
  leaveEvent,
  getMyBookings,
  getEventParticipants,
} from './booking.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'

const router = Router()

router.get('/my', protect, getMyBookings)
router.get('/:eventId/participants', protect, allowTo('host', 'admin'), getEventParticipants)
router.post('/:id/join', protect, allowTo('user'), joinEvent)
router.post('/:id/leave', protect, leaveEvent)

export default router