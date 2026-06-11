import mongoose, { Document, Schema } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  amount: number
  currency: string
  transactionId: string
  status: 'success' | 'failed' | 'cancelled' | 'pending'
  paidAt: Date
}

const paymentSchema = new Schema<IPayment>(
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
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    transactionId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'cancelled', 'pending'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

const Payment = mongoose.model<IPayment>('Payment', paymentSchema)
export default Payment