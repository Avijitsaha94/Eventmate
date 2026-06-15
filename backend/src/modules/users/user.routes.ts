import { Router, Request, Response } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUserProfile,
  getTopHosts,
} from './user.controller'
import { protect, AuthRequest } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'
import { upload } from '../../config/multer'
import { uploadToCloudinary } from '../../utils/uploadToCloudinary'
import { updateUserProfileService } from './user.service'
import { becomeHost } from './user.controller'

const router = Router()

router.get('/', protect, allowTo('admin'), getAllUsers)
router.get('/top-hosts', getTopHosts)
router.get('/:id', getUserById)

router.patch('/profile', protect, updateUserProfile)
router.patch('/:id/status', protect, allowTo('admin'), updateUserStatus)
router.patch('/:id/role', protect, allowTo('admin'), updateUserRole)
router.post('/become-host', protect, becomeHost)

// Avatar upload
router.post(
  '/upload-avatar',
  protect,
  upload.single('avatar'),
  async (req: AuthRequest, res: Response): Promise<void> => {
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
  }
)

export default router