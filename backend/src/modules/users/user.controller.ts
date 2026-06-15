import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import { getTopHostsService } from './user.service'
import {
  getAllUsersService,
  getUserByIdService,
  updateUserStatusService,
  updateUserRoleService,
  updateUserProfileService,
} from './user.service'

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService()
    res.status(200).json({ success: true, data: users })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getUserByIdService(req.params.id)
    res.status(200).json({ success: true, data: user })
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message })
  }
}

export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await updateUserStatusService(req.params.id, req.body.isActive)
    res.status(200).json({ success: true, data: user })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await updateUserRoleService(req.params.id, req.body.role)
    res.status(200).json({ success: true, data: user })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await updateUserProfileService(req.user!._id, req.body)
    res.status(200).json({ success: true, data: user })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getTopHosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const hosts = await getTopHostsService()
    res.status(200).json({ success: true, data: hosts })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}