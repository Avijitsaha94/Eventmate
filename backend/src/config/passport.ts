import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../modules/users/user.model'
import dotenv from 'dotenv'

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Already exists কিনা check করো
        let user = await User.findOne({ email: profile.emails?.[0].value })

        if (user) {
          // Avatar update করো Google থেকে
          if (!user.avatar && profile.photos?.[0].value) {
            user.avatar = profile.photos[0].value
            await user.save()
          }
          return done(null, user as any)
        }

        // নতুন user তৈরি করো
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          password: `google_${profile.id}_${Date.now()}`,
          avatar: profile.photos?.[0].value || '',
          role: 'user',
        })

        return done(null, user as any)
      } catch (error) {
        return done(error as Error, undefined)
      }
    }
  )
)

export default passport