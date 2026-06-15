import { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUserProfile,
} from './user.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'
import { getTopHosts } from './user.controller'
const router = Router()

router.get('/', protect, allowTo('admin'), getAllUsers)
router.get('/:id', getUserById)
router.get('/top-hosts', getTopHosts)
router.patch('/profile', protect, updateUserProfile)
router.patch('/:id/status', protect, allowTo('admin'), updateUserStatus)
router.patch('/:id/role', protect, allowTo('admin'), updateUserRole)

export default router