import { Router, Response, RequestHandler } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUserProfile,
  getTopHosts,
  becomeHost,
  getAdminChartData,
} from './user.controller'
import { protect, AuthRequest } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'
import { upload } from '../../config/multer'
import { uploadToCloudinary } from '../../utils/uploadToCloudinary'
import { updateUserProfileService } from './user.service'

const router = Router()

router.get('/', protect, allowTo('admin'), getAllUsers as RequestHandler)
router.get('/top-hosts', getTopHosts)
router.get('/admin/chart-data', protect, allowTo('admin'), getAdminChartData as RequestHandler)
router.get('/:id', getUserById)

router.patch('/profile', protect, updateUserProfile as RequestHandler)
router.patch('/:id/status', protect, allowTo('admin'), updateUserStatus as RequestHandler)
router.patch('/:id/role', protect, allowTo('admin'), updateUserRole as RequestHandler)
router.post('/become-host', protect, becomeHost as RequestHandler)

// Avatar upload
router.post(
  '/upload-avatar',
  protect,
  upload.single('avatar'),
  (async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' })
        return
      }

      const imageUrl = await uploadToCloudinary(req.file.buffer, {
        folder: 'eventmate/avatars',
        width: 400,
        height: 400,
      })

      const user = await updateUserProfileService(req.user!._id, {
        avatar: imageUrl,
      })

      res.status(200).json({
        success: true,
        data: { avatarUrl: imageUrl, user },
      })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }) as RequestHandler
)

export default router