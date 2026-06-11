import mongoose, { Document, Schema } from 'mongoose'

export interface IEvent extends Document {
  title: string
  type: string
  description: string
  image: string
  hostId: mongoose.Types.ObjectId
  date: Date
  location: string
  minParticipants: number
  maxParticipants: number
  currentParticipants: number
  fee: number
  status: 'open' | 'full' | 'cancelled' | 'completed'
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Concert',
        'Hiking',
        'Food',
        'Gaming',
        'Sports',
        'Tech',
        'Art',
        'Travel',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    minParticipants: {
      type: Number,
      default: 1,
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      default: 0, // 0 মানে free event
    },
    status: {
      type: String,
      enum: ['open', 'full', 'cancelled', 'completed'],
      default: 'open',
    },
  },
  { timestamps: true }
)

const Event = mongoose.model<IEvent>('Event', eventSchema)
export default Event