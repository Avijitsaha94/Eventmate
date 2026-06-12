import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modules/users/user.model'

export interface AuthRequest extends Request {
  user?: {
    _id: string
    email: string
    role: string
  }
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Token header থেকে নাও
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Not authorized, no token' })
      return
    }

    const token = authHeader.split(' ')[1]

    // Token verify করো
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { _id: string; email: string; role: string }

    // User exist করে কিনা check করো
    const user = await User.findById(decoded._id).select('-password')
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' })
      return
    }

    // User active আছে কিনা check করো
    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Your account has been blocked' })
      return
    }

    req.user = { _id: String(user._id), email: user.email, role: user.role }
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is invalid or expired' })
  }
}