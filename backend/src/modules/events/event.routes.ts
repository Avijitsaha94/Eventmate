import { Router, Response } from 'express'
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
import { protect, AuthRequest } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'
import { upload } from '../../config/multer'
import { uploadToCloudinary } from '../../utils/uploadToCloudinary'

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

// Event image upload
router.post(
  '/upload-image',
  protect,
  allowTo('host', 'admin'),
  upload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' })
        return
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer, {
        folder: 'eventmate/events',
        width: 800,
        height: 500,
      })

      res.status(200).json({ success: true, data: { imageUrl } })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
)

export default router