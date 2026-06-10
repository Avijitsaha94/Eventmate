import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

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

// Routes — পরে যোগ করবো
// app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/events', eventRoutes)

export default app