import express, { Application } from 'express'
import { errorHandler } from './middleware/error.middleware'
import './modules/users/user.model'
import './modules/events/event.model'
import './modules/bookings/booking.model'
import './modules/reviews/review.model'
import './modules/payments/payment.model'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes'

dotenv.config()

const app: Application = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ EventMate API is running' })
})
app.use('/api/auth', authRoutes)
// Routes — পরে যোগ করবো
// app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/events', eventRoutes)
app.use(errorHandler)
export default app