import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  reviewerId: mongoose.Types.ObjectId
  hostId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
)

// একজন user একটা event এ একবারই review দিতে পারবে
reviewSchema.index({ reviewerId: 1, eventId: 1 }, { unique: true })

const Review = mongoose.model<IReview>('Review', reviewSchema)
export default Review