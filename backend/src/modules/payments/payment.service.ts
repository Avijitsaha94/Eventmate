import SSLCommerzPayment from 'sslcommerz-lts'
import Payment from './payment.model'
import Booking from '../bookings/booking.model'
import Event from '../events/event.model'
import User from '../users/user.model'

const store_id = process.env.SSLCOMMERZ_STORE_ID as string
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD as string
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true'

// Payment শুরু করো
export const createPaymentService = async (
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

  // Free event এ payment লাগবে না
  if (event.fee === 0) {
    throw new Error('This is a free event, no payment required')
  }

  // Already joined কিনা check করো
  const existingBooking = await Booking.findOne({
    userId,
    eventId,
    status: 'confirmed',
  })
  if (existingBooking) throw new Error('You have already joined this event')

  // User info আনো
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  // Unique transaction ID তৈরি করো
  const transactionId = `EVT-${Date.now()}-${userId.slice(-4)}`

  // Pending payment তৈরি করো
  const payment = await Payment.create({
    userId,
    eventId,
    amount: event.fee,
    currency: 'BDT',
    transactionId,
    status: 'pending',
  })

  // Pending booking তৈরি করো
  await Booking.create({
    userId,
    eventId,
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentId: payment._id,
  })

  // SSLCommerz data তৈরি করো
  const data = {
    total_amount: event.fee,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${process.env.BACKEND_URL}/api/payments/success`,
    fail_url: `${process.env.BACKEND_URL}/api/payments/fail`,
    cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel`,
    ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,
    shipping_method: 'Courier',
    product_name: event.title,
    product_category: 'Event',
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.location || 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    ship_name: user.name,
    ship_add1: 'Dhaka',
    ship_city: 'Dhaka',
    ship_country: 'Bangladesh',
  }

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  const apiResponse = await sslcz.init(data)

  if (!apiResponse?.GatewayPageURL) {
    // Payment শুরু না হলে cleanup করো
    await Payment.findByIdAndDelete(payment._id)
    await Booking.findOneAndDelete({ userId, eventId, paymentStatus: 'pending' })
    throw new Error('Payment gateway initialization failed')
  }

  return { gatewayUrl: apiResponse.GatewayPageURL, transactionId }
}

// Payment success
export const paymentSuccessService = async (data: any) => {
  const { tran_id, val_id, amount, card_type } = data

  // Transaction verify করো
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  const validation = await sslcz.validate({ val_id })

  if (
    validation?.status !== 'VALID' &&
    validation?.status !== 'VALIDATED'
  ) {
    // Validation fail হলে payment fail করো
    await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: 'failed' }
    )
    return { success: false }
  }

  // Payment update করো
  const payment = await Payment.findOneAndUpdate(
    { transactionId: tran_id },
    {
      status: 'success',
      paidAt: new Date(),
    },
    { new: true }
  )

  if (!payment) return { success: false }

  // Booking update করো
  await Booking.findOneAndUpdate(
    { userId: payment.userId, eventId: payment.eventId },
    { paymentStatus: 'paid' }
  )
// paymentSuccessService এ payment update এর পরে:
try {
  const userDoc = await User.findById(payment.userId)
  const eventDoc = await Event.findById(payment.eventId)
  if (userDoc && eventDoc) {
    await sendBookingConfirmationEmail(
      userDoc.email,
      userDoc.name,
      eventDoc.title,
      format(new Date(eventDoc.date), 'MMMM dd, yyyy — h:mm a'),
      eventDoc.location,
      true,
      payment.amount
    )
  }
} catch (emailError) {
  console.error('Email error:', emailError)
}
  // Event participant count বাড়াও
  const event = await Event.findById(payment.eventId)
  if (event) {
    await Event.findByIdAndUpdate(payment.eventId, {
      $inc: { currentParticipants: 1 },
    })
    // Full হলে status update করো
    if (event.currentParticipants + 1 >= event.maxParticipants) {
      await Event.findByIdAndUpdate(payment.eventId, { status: 'full' })
    }
  }

  return { success: true, eventId: payment.eventId }
}

// Payment fail
export const paymentFailService = async (data: any) => {
  const { tran_id } = data

  const payment = await Payment.findOneAndUpdate(
    { transactionId: tran_id },
    { status: 'failed' },
    { new: true }
  )

  if (payment) {
    // Pending booking cancel করো
    await Booking.findOneAndDelete({
      userId: payment.userId,
      eventId: payment.eventId,
      paymentStatus: 'pending',
    })
  }

  return { success: false }
}

// Payment cancel
export const paymentCancelService = async (data: any) => {
  const { tran_id } = data

  const payment = await Payment.findOneAndUpdate(
    { transactionId: tran_id },
    { status: 'cancelled' },
    { new: true }
  )

  if (payment) {
    // Pending booking cancel করো
    await Booking.findOneAndDelete({
      userId: payment.userId,
      eventId: payment.eventId,
      paymentStatus: 'pending',
    })
  }

  return { success: false }
}

// Host এর revenue আনো
export const getHostRevenueService = async (hostId: string) => {
  // Host এর সব events আনো
  const events = await Event.find({ hostId })
  const eventIds = events.map((e) => e._id)

  // Successful payments আনো
  const payments = await Payment.find({
    eventId: { $in: eventIds },
    status: 'success',
  })
    .populate('userId', 'name email avatar')
    .populate('eventId', 'title date fee')
    .sort({ paidAt: -1 })

  // Total revenue calculate করো
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)

  // Per event revenue
  const revenueByEvent = events.map((event) => {
    const eventPayments = payments.filter(
      (p) => String(p.eventId._id) === String(event._id)
    )
    return {
      event: event.title,
      date: event.date,
      revenue: eventPayments.reduce((sum, p) => sum + p.amount, 0),
      participants: eventPayments.length,
    }
  })

  return { totalRevenue, payments, revenueByEvent }
}

// User এর payment history
export const getMyPaymentsService = async (userId: string) => {
  const payments = await Payment.find({ userId, status: 'success' })
    .populate('eventId', 'title date location image')
    .sort({ paidAt: -1 })
  return payments
}