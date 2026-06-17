import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modules/users/user.model'

export interface AppUser {
  _id: string
  email: string
  role: string
}

export interface AuthRequest extends Request {
  user?: AppUser
}

const protectHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Not authorized, no token' })
      return
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { _id: string; email: string; role: string }

    const user = await User.findById(decoded._id).select('-password')
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' })
      return
    }

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

// Express এর route registration এর সাথে compatible করার জন্য cast
export const protect: RequestHandler = protectHandler as RequestHandler