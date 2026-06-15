import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/error.middleware'

// Models
import './modules/users/user.model'
import './modules/events/event.model'
import './modules/bookings/booking.model'
import './modules/reviews/review.model'
import './modules/payments/payment.model'

// Routes
import authRoutes from './modules/auth/auth.routes'
import eventRoutes from './modules/events/event.routes'
import bookingRoutes from './modules/bookings/booking.routes'
import paymentRoutes from './modules/payments/payment.routes'

dotenv.config()

const app: Application = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: '✅ EventMate API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)

app.use(errorHandler)

export default app