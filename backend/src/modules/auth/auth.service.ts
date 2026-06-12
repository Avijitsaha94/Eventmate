import jwt from 'jsonwebtoken'
import User, { IUser } from '../users/user.model'

// JWT token generate করো
const generateToken = (user: IUser): string => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )
}

// Register
export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  // Email already exists কিনা check করো
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('Email already registered')
  }

  // User তৈরি করো
  const user = await User.create({ name, email, password })
  const token = generateToken(user)

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  }
}

// Login
export const loginService = async (email: string, password: string) => {
  // Password সহ user খোঁজো (select: false ছিল তাই +password দিতে হবে)
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Account blocked কিনা check করো
  if (!user.isActive) {
    throw new Error('Your account has been blocked. Contact support.')
  }

  // Password match করো
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  const token = generateToken(user)

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  }
}

// Get current user
export const getMeService = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return user
}