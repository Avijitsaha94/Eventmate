import Booking from './booking.model'
import Event from '../events/event.model'
import { sendBookingConfirmationEmail } from '../../config/email'
import User from '../users/user.model'
import { format } from 'date-fns'

// Event join করো
export const joinEventService = async (
  userId: string,
  eventId: string
) => {
  // Event আছে কিনা check করো
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')

  // Event open আছে কিনা check করো
  if (event.status !== 'open') {
    throw new Error('This event is not accepting participants')
  }

  // Max participants পূর্ণ কিনা check করো
  if (event.currentParticipants >= event.maxParticipants) {
    throw new Error('Event is full')
  }

  // Host নিজের event এ join করতে পারবে না
  if (String(event.hostId) === userId) {
    throw new Error('Host cannot join their own event')
  }


// joinEventService function এর শেষে booking return করার আগে:
try {
  const userDoc = await User.findById(userId)
  if (userDoc) {
    await sendBookingConfirmationEmail(
      userDoc.email,
      userDoc.name,
      event.title,
      format(new Date(event.date), 'MMMM dd, yyyy — h:mm a'),
      event.location,
      false
    )
  }
} catch (emailError) {
  // Email fail হলেও booking যাবে
  console.error('Email error:', emailError)
}
  // Already joined কিনা check করো
  const existingBooking = await Booking.findOne({ userId, eventId })
  if (existingBooking) {
    if (existingBooking.status === 'confirmed') {
      throw new Error('You have already joined this event')
    }
    // Cancelled booking থাকলে reactivate করো
    existingBooking.status = 'confirmed'
    existingBooking.paymentStatus = event.fee === 0 ? 'free' : 'pending'
    await existingBooking.save()

    // Participant count বাড়াও
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentParticipants: 1 },
    })

    // Full হলে status update করো
    if (event.currentParticipants + 1 >= event.maxParticipants) {
      await Event.findByIdAndUpdate(eventId, { status: 'full' })
    }

    return existingBooking
  }

  // নতুন booking তৈরি করো
  const booking = await Booking.create({
    userId,
    eventId,
    paymentStatus: event.fee === 0 ? 'free' : 'pending',
  })

  // Participant count বাড়াও
  await Event.findByIdAndUpdate(eventId, {
    $inc: { currentParticipants: 1 },
  })

  // Full হলে status update করো
  if (event.currentParticipants + 1 >= event.maxParticipants) {
    await Event.findByIdAndUpdate(eventId, { status: 'full' })
  }

  return booking
}

// Event leave করো
export const leaveEventService = async (
  userId: string,
  eventId: string
) => {
  const booking = await Booking.findOne({ userId, eventId, status: 'confirmed' })
  if (!booking) throw new Error('You are not part of this event')

  booking.status = 'cancelled'
  await booking.save()

  // Participant count কমাও
  await Event.findByIdAndUpdate(eventId, {
    $inc: { currentParticipants: -1 },
  })

  // Full ছিল কিনা check করো, open করো
  const event = await Event.findById(eventId)
  if (event && event.status === 'full') {
    await Event.findByIdAndUpdate(eventId, { status: 'open' })
  }

  return { message: 'Successfully left the event' }
}

// আমার সব bookings
export const getMyBookingsService = async (userId: string) => {
  const bookings = await Booking.find({ userId, status: 'confirmed' })
    .populate({
      path: 'eventId',
      populate: { path: 'hostId', select: 'name avatar' },
    })
    .sort({ joinedAt: -1 })
  return bookings
}

// Event এর participants list
export const getEventParticipantsService = async (
  eventId: string,
  hostId: string
) => {
  // Host নিজের event এর participants দেখতে পারবে
  const event = await Event.findById(eventId)
  if (!event) throw new Error('Event not found')
  if (String(event.hostId) !== hostId) {
    throw new Error('Not authorized')
  }

  const bookings = await Booking.find({
    eventId,
    status: 'confirmed',
  }).populate('userId', 'name email avatar')

  return bookings
}