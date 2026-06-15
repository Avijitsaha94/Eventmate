import User from './user.model'

// সব users আনো (admin only)
export const getAllUsersService = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  return users
}

// User status update (block/unblock)
export const updateUserStatusService = async (
  userId: string,
  isActive: boolean
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  ).select('-password')
  if (!user) throw new Error('User not found')
  return user
}

// User role update
export const updateUserRoleService = async (
  userId: string,
  role: string
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select('-password')
  if (!user) throw new Error('User not found')
  return user
}

// Single user আনো
export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select('-password')
  if (!user) throw new Error('User not found')
  return user
}

// Profile update
export const updateUserProfileService = async (
  userId: string,
  data: any
) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
  }).select('-password')
  if (!user) throw new Error('User not found')
  return user
}