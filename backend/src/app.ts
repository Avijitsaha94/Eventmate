import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from './config/passport'
import { errorHandler } from './middleware/error.middleware'
import { apiLimiter, authLimiter, paymentLimiter } from './modules/rateLimit.middleware'
import contactRoutes from './modules/contact/contact.routes'

// Models
import './modules/users/user.model'
import './modules/events/event.model'
import './modules/bookings/booking.model'
import './modules/reviews/review.model'
import './modules/payments/payment.model'

// Routes
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/user.routes'
import eventRoutes from './modules/events/event.routes'
import bookingRoutes from './modules/bookings/booking.routes'
import paymentRoutes from './modules/payments/payment.routes'
import reviewRoutes from './modules/reviews/review.routes'

dotenv.config()

const app: Application = express()
app.set('trust proxy', 1)
// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session (Google OAuth এর জন্য)
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}))

// Passport
app.use(passport.initialize())

// Rate limiting
app.use('/api', apiLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/payments/create-intent', paymentLimiter)


// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ EventMate API is running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/contact', contactRoutes)

// Global error handler
app.use(errorHandler)

export default app