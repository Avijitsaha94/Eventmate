import { Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import {
  joinEventService,
  leaveEventService,
  getMyBookingsService,
  getEventParticipantsService,
} from './booking.service'

export const joinEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id as string
    const booking = await joinEventService(req.user!._id, eventId)
    res.status(201).json({ success: true, message: 'Joined successfully', data: booking })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const leaveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id as string
    const result = await leaveEventService(req.user!._id, eventId)
    res.status(200).json({ success: true, message: result.message })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await getMyBookingsService(req.user!._id)
    res.status(200).json({ success: true, data: bookings })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getEventParticipants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string
    const bookings = await getEventParticipantsService(eventId, req.user!._id)
    res.status(200).json({ success: true, data: bookings })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}