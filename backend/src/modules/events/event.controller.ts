import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import {
  getAllEventsService,
  getEventByIdService,
  createEventService,
  updateEventService,
  deleteEventService,
  updateEventStatusService,
  getHostEventsService,
  getFeaturedEventsService,
} from './event.service'

// সব events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAllEventsService(req.query)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Single event
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await getEventByIdService(req.params.id)
    res.status(200).json({ success: true, data: event })
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message })
  }
}

// Event তৈরি করো
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await createEventService(req.user!._id, req.body)
    res.status(201).json({ success: true, message: 'Event created', data: event })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Event update
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await updateEventService(req.params.id, req.user!._id, req.body)
    res.status(200).json({ success: true, message: 'Event updated', data: event })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Event delete
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteEventService(req.params.id, req.user!._id, req.user!.role)
    res.status(200).json({ success: true, message: 'Event deleted' })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Status update
export const updateEventStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await updateEventStatusService(
      req.params.id,
      req.user!._id,
      req.body.status
    )
    res.status(200).json({ success: true, message: 'Status updated', data: event })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Host events
export const getHostEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await getHostEventsService(req.params.hostId)
    res.status(200).json({ success: true, data: events })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Featured events
export const getFeaturedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await getFeaturedEventsService()
    res.status(200).json({ success: true, data: events })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}