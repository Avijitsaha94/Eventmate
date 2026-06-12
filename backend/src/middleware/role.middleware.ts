import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'

export const allowTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to access this route`,
      })
      return
    }
    next()
  }
}