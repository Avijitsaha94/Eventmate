import { Router } from 'express'
import { register, login, getMe } from './auth.controller'
import { protect } from '../../middleware/auth.middleware'
import passport from '../../config/passport'
import jwt from 'jsonwebtoken'
import { IUser } from '../users/user.model'
import {  RequestHandler } from 'express'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe as RequestHandler)
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`, session: false }),
  (req, res) => {
    const user = req.user as any as IUser
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )
    // Token সহ frontend এ redirect করো
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&role=${user.role}&avatar=${encodeURIComponent(user.avatar || '')}`
    )
  }
)

export default router