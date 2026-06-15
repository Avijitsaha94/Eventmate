import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './modules/users/user.model'

dotenv.config()

const seedDemoUsers = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string)
  console.log('✅ Connected to MongoDB')

  const demoUsers = [
    {
      name: 'Demo User',
      email: 'demo.user@eventmate.com',
      password: 'demo1234',
      role: 'user' as const,
      bio: 'I love attending events and meeting new people!',
      interests: ['Music', 'Food', 'Sports'],
      location: 'Dhaka',
    },
    {
      name: 'Demo Host',
      email: 'demo.host@eventmate.com',
      password: 'demo1234',
      role: 'host' as const,
      bio: 'I organize amazing events in Dhaka!',
      interests: ['Concert', 'Food', 'Tech'],
      location: 'Dhaka',
    },
    {
      name: 'Demo Admin',
      email: 'demo.admin@eventmate.com',
      password: 'demo1234',
      role: 'admin' as const,
      bio: 'Platform administrator',
      location: 'Dhaka',
    },
  ]

  for (const demo of demoUsers) {
    const exists = await User.findOne({ email: demo.email })
    if (exists) {
      console.log(`⏭️  ${demo.email} already exists`)
      continue
    }
    await User.create(demo)
    console.log(`✅ Created ${demo.role}: ${demo.email}`)
  }

  console.log('🎉 Demo users seeded successfully!')
  await mongoose.disconnect()
  process.exit(0)
}

seedDemoUsers().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})