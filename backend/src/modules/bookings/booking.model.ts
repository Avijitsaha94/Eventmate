import mongoose, { Document, Schema } from 'mongoose'

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  status: 'confirmed' | 'cancelled'
  paymentStatus: 'free' | 'paid' | 'pending'
  paymentId: mongoose.Types.ObjectId | null
  joinedAt: Date
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['free', 'paid', 'pending'],
      default: 'free',
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// একই user একই event এ দুইবার join করতে পারবে না
bookingSchema.index({ userId: 1, eventId: 1 }, { unique: true })

const Booking = mongoose.model<IBooking>('Booking', bookingSchema)
export default Booking