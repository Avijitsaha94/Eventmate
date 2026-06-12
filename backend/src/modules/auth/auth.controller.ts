import { Request, Response } from 'express'
import { registerService, loginService, getMeService } from './auth.service'
import { AuthRequest } from '../../middleware/auth.middleware'

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
      return
    }

    const result = await registerService(name, email, password)
    res.status(201).json({ success: true, message: 'Registration successful', data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' })
      return
    }

    const result = await loginService(email, password)
    res.status(200).json({ success: true, message: 'Login successful', data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Get current user
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getMeService(req.user!._id)
    res.status(200).json({ success: true, data: user })
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message })
  }
}