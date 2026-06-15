import Event, { IEvent } from './event.model'
import Booking from '../bookings/booking.model'

// সব events আনো (filter সহ)
export const getAllEventsService = async (query: any) => {
  const {
    type, location, status, fee, search,
    page = 1, limit = 9, sort = 'newest',
  } = query

  const filter: any = {}

  if (type) filter.type = type
  if (location) filter.location = { $regex: location, $options: 'i' }
  if (status) filter.status = status
  else filter.status = 'open'

  if (fee === 'free') filter.fee = 0
  if (fee === 'paid') filter.fee = { $gt: 0 }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  // Sort mapping
  let sortQuery: any = { date: 1 } // default: newest/upcoming first
  if (sort === 'price-low') sortQuery = { fee: 1 }
  if (sort === 'price-high') sortQuery = { fee: -1 }
  if (sort === 'popular') sortQuery = { currentParticipants: -1 }
  if (sort === 'newest') sortQuery = { createdAt: -1 }

  const skip = (Number(page) - 1) * Number(limit)
  const total = await Event.countDocuments(filter)
  const events = await Event.find(filter)
    .populate('hostId', 'name avatar location')
    .sort(sortQuery)
    .skip(skip)
    .limit(Number(limit))

  return {
    events,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  }
}

// Single event আনো
export const getEventByIdService = async (eventId: string) => {
  const event = await Event.findById(eventId).populate(
    'hostId',
    'name avatar bio location'
  )
  if (!event) throw new Error('Event not found')
  return event
}

// Event তৈরি করো
export const createEventService = async (
  hostId: string,
  data: Partial<IEvent>
) => {
  const event = await Event.create({ ...data, hostId })
  return event
}

// Event update করো
export const updateEventService = async (
  eventId: string,
  hostId: string,
  data: Partial<IEvent>
) => {
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')
  if (String(event.hostId) !== hostId) {
    throw new Error('Not authorized to update this event')
  }
  const updated = await Event.findByIdAndUpdate(eventId, data, { new: true })
  return updated
}

// Event delete করো
export const deleteEventService = async (
  eventId: string,
  userId: string,
  role: string
) => {
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')
  if (role !== 'admin' && String(event.hostId) !== userId) {
    throw new Error('Not authorized to delete this event')
  }
  await Event.findByIdAndDelete(eventId)
}

// Event status update করো
export const updateEventStatusService = async (
  eventId: string,
  hostId: string,
  status: string
) => {
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')
  if (String(event.hostId) !== hostId) {
    throw new Error('Not authorized to update this event')
  }
  event.status = status as IEvent['status']
  await event.save()
  return event
}


// Related events — same type or location, excluding current
export const getRelatedEventsService = async (eventId: string) => {
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')

  const related = await Event.find({
    _id: { $ne: eventId },
    status: 'open',
    $or: [{ type: event.type }, { location: event.location }],
  })
    .populate('hostId', 'name avatar')
    .limit(4)

  return related
}
// Host এর সব events আনো
export const getHostEventsService = async (hostId: string) => {
  const events = await Event.find({ hostId }).sort({ createdAt: -1 })
  return events
}

// Featured events (homepage এর জন্য)
export const getFeaturedEventsService = async () => {
  const events = await Event.find({ status: 'open' })
    .populate('hostId', 'name avatar')
    .sort({ date: 1 })
    .limit(6)
  return events
}