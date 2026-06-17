import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 pt-16 pb-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">EventMate</h3>
            <p className="text-sm leading-relaxed mb-4">
              Connecting people through shared experiences and activities.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-white transition">All Events</Link></li>
              <li><Link href="/events?type=Concert" className="hover:text-white transition">Concerts</Link></li>
              <li><Link href="/events?type=Hiking" className="hover:text-white transition">Hiking</Link></li>
              <li><Link href="/events?type=Tech" className="hover:text-white transition">Tech Meetups</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white transition">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link href="/events/create" className="hover:text-white transition">Host an Event</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 hello@eventmate.com</li>
              <li>📍 Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p>© 2026 EventMate. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
           <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}