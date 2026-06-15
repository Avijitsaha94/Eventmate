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
// যেকোনো user নিজে host হতে পারবে
export const becomeHostService = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  if (user.role === 'host') throw new Error('You are already a host')
  if (user.role === 'admin') throw new Error('Admins cannot become hosts')

  user.role = 'host'
  await user.save()
  return user
}

// Top hosts আনো (review average দিয়ে)
export const getTopHostsService = async () => {
  // Host role এর users আনো
  const hosts = await User.find({ role: 'host', isActive: true })
    .select('name avatar location')
    .limit(8)

  // প্রতিটা host এর average rating calculate করো
  const Review = require('../reviews/review.model').default
  const hostsWithRating = await Promise.all(
    hosts.map(async (host) => {
      const reviews = await Review.find({ hostId: host._id })
      const avg =
        reviews.length > 0
          ? reviews.reduce((s: number, r: any) => s + r.rating, 0) /
            reviews.length
          : 0
      return { ...host.toObject(), averageRating: avg, totalReviews: reviews.length }
    })
  )

  // Rating এর ভিত্তিতে sort করো
  return hostsWithRating.sort((a, b) => b.averageRating - a.averageRating).slice(0, 4)
}

// Admin chart — user role distribution + event status distribution
export const getAdminChartDataService = async () => {
  const Event = require('../events/event.model').default

  const users = await User.find()
  const events = await Event.find()

  // Role distribution
  const roleCount = { user: 0, host: 0, admin: 0 }
  users.forEach((u: any) => {
    roleCount[u.role] = (roleCount[u.role] || 0) + 1
  })
  const roleData = Object.entries(roleCount).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count,
  }))

  // Event status distribution
  const statusCount = { open: 0, full: 0, completed: 0, cancelled: 0 }
  events.forEach((e: any) => {
    statusCount[e.status] = (statusCount[e.status] || 0) + 1
  })
  const statusData = Object.entries(statusCount).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }))

  // Events created per month (last 6 months)
  const months: { [key: string]: number } = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    months[key] = 0
  }
  events.forEach((e: any) => {
    const d = new Date(e.createdAt)
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    if (months[key] !== undefined) months[key] += 1
  })
  const eventsPerMonth = Object.entries(months).map(([month, count]) => ({
    month,
    events: count,
  }))

  return { roleData, statusData, eventsPerMonth }
}