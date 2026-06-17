export interface IUser {
  _id: string
  name: string
  email: string
  role: 'user' | 'host' | 'admin'
  avatar: string
  bio?: string
  interests?: string[]
  location?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: IUser
  }
}

export interface IEvent {
  _id: string
  title: string
  type: string
  description: string
  image: string
  hostId: {
    _id: string
    name: string
    avatar: string
    location?: string
    bio?: string
  }
  date: string
  location: string
  minParticipants: number
  maxParticipants: number
  currentParticipants: number
  fee: number
  status: 'open' | 'full' | 'cancelled' | 'completed'
  createdAt: string
}

export interface IBooking {
  _id: string
  userId: string
  eventId: IEvent
  status: 'confirmed' | 'cancelled'
  paymentStatus: 'free' | 'paid' | 'pending'
  joinedAt: string
}

export interface IReview {
  _id: string
  rating: number
  comment: string
  createdAt: string
  reviewerId: {
    _id: string
    name: string
    avatar: string
  }
  hostId: string
  eventId: {
    _id: string
    title: string
    date: string
  }
}

export interface IReviewSummary {
  reviews: IReview[]
  averageRating: number
  totalReviews: number
}