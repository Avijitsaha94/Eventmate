/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import EventCardSkeleton from '@/components/events/EventCardSkeleton'
import api from '@/lib/axios'
import { IEvent } from '@/types'
import { format } from 'date-fns'
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Music,
  Mountain,
  Utensils,
  Gamepad2,
  Trophy,
  Laptop,
} from 'lucide-react'

// ────────────────────────────────
// Section 1 — Hero
// ────────────────────────────────
function HeroSection() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { emoji: '🎵', text: 'Concerts & Music Festivals' },
    { emoji: '🥾', text: 'Hiking & Outdoor Adventures' },
    { emoji: '🍜', text: 'Food Festivals & Tastings' },
    { emoji: '💻', text: 'Tech Meetups & Workshops' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/events?search=${search}`)
  }

  return (
    <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-blue-950/20 dark:via-gray-950 dark:to-gray-950 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center w-full">
        {/* Animated Slide Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 transition-all duration-500">
          <span className="text-base">{slides[currentSlide].emoji}</span>
          <span key={currentSlide} className="animate-fadeIn">{slides[currentSlide].text}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
          Find Your Next
          <span className="text-blue-600 dark:text-blue-400"> Adventure</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Discover local events, join activities, and meet amazing people who
          share your interests. No more going alone!
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, activities..."
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Search
          </button>
        </form>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/events" className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-blue-700 transition">
            Explore Events
          </Link>
          <Link href="/become-host" className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3.5 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Become a Host
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-12 text-center">
          {[
            { value: '500+', label: 'Events' },
            { value: '2000+', label: 'Members' },
            { value: '50+', label: 'Cities' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
// ────────────────────────────────
// Section 2 — How It Works
// ────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Browse Events',
      desc: 'Search and filter events by category, date, or location near you.',
      icon: Search,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      step: '02',
      title: 'Join & Connect',
      desc: 'Join free or paid events with a single click. Meet like-minded people.',
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      step: '03',
      title: 'Have Fun Together',
      desc: 'Attend the event, make new friends and create unforgettable memories.',
      icon: Star,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500">
            Three simple steps to your next adventure
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="text-center">
                <div
                  className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon size={28} />
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-widest">
                  STEP {step.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────
// Section 3 — Categories
// ────────────────────────────────
function CategoriesSection() {
  const router = useRouter()

 const categories = [
  { label: 'Concert', icon: Music, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50' },
  { label: 'Hiking', icon: Mountain, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50' },
  { label: 'Food', icon: Utensils, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50' },
  { label: 'Gaming', icon: Gamepad2, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50' },
  { label: 'Sports', icon: Trophy, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50' },
  { label: 'Tech', icon: Laptop, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50' },
]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Browse by Category
          </h2>
          <p className="text-gray-500">Find events that match your interests</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.label}
                onClick={() => router.push(`/events?type=${cat.label}`)}
                className={`${cat.color} rounded-2xl p-5 flex flex-col items-center gap-3 transition cursor-pointer border border-transparent hover:border-current/10`}
              >
                <Icon size={28} />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────
// Section 4 — Featured Events
// ────────────────────────────────
function FeaturedEventsSection() {
  const [events, setEvents] = useState<IEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/events/featured')
      .then((res) => setEvents(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Upcoming Events
            </h2>
            <p className="text-gray-500">Dont miss out on these experiences</p>
          </div>
          <Link
            href="/events"
            className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

       {loading ? (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
)  : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition group"
              >
                <div className="relative h-44 bg-gray-100">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-purple-50">
                      🎪
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white text-xs font-medium px-2 py-1 rounded-full shadow">
                      {event.fee === 0 ? 'Free' : `৳${event.fee}`}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                    {event.type}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} />
                      {event.currentParticipants}/{event.maxParticipants} joined
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-16 px-4 bg-blue-600 dark:bg-blue-800">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Never Miss an Event
        </h2>
        <p className="text-blue-100 mb-6">
          Subscribe to get weekly updates on new events near you.
        </p>
        {subscribed ? (
          <p className="text-white font-medium">✅ Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
// ────────────────────────────────
// Section 5 — Top Hosts
// ────────────────────────────────
function TopHostsSection() {
  const [hosts, setHosts] = useState<any[]>([])

  useEffect(() => {
    api
      .get('/api/users/top-hosts')
      .then((res) => setHosts(res.data.data))
      .catch(console.error)
  }, [])

  if (hosts.length === 0) return null

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Top Rated Hosts
          </h2>
          <p className="text-gray-500">
            Trusted organizers with amazing track records
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {hosts.map((host: any) => (
            <Link
              key={host._id}
              href={`/profile/${host._id}`}
              className="bg-white rounded-2xl border p-5 text-center hover:shadow-md transition"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mx-auto mb-3">
                {host.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-gray-900 mb-1">{host.name}</p>
              <p className="text-xs text-gray-500 mb-2">{host.location || 'Bangladesh'}</p>
              <div className="flex items-center justify-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-gray-700">
                  {host.averageRating?.toFixed(1) || '5.0'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { q: 'How do I join an event?', a: 'Browse events, click on one you like, and hit "Join Event". Free events confirm instantly; paid events redirect you to secure checkout.' },
    { q: 'How do I become a host?', a: 'Click "Become a Host" in the navbar or footer. It\'s free — you only need an account to start creating events.' },
    { q: 'Is payment secure?', a: 'Yes, all payments are processed through SSLCommerz, supporting bKash, Nagad, Rocket, and major cards with bank-level security.' },
    { q: 'Can I cancel a joined event?', a: 'Yes, go to your dashboard, find the event under "Upcoming", and click "Leave Event" anytime before it starts.' },
    { q: 'How do reviews work?', a: 'After attending a completed event, you can leave a star rating and comment for the host — helping others choose great events.' },
  ]

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Everything you need to know about EventMate
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {faq.q}
                </span>
                <span className={`text-gray-400 transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
// ────────────────────────────────
// Section 6 — Why Choose Us / CTA
// ────────────────────────────────
function WhyUsSection() {
  const features = [
    {
      icon: '🔒',
      title: 'Safe & Secure',
      desc: 'Verified hosts and secure payment processing for every event.',
    },
    {
      icon: '🌍',
      title: 'Local & Global',
      desc: 'Find events in your city or explore new places around the country.',
    },
    {
      icon: '💬',
      title: 'Real Reviews',
      desc: 'Honest ratings from real attendees to help you choose the best events.',
    },
    {
      icon: '🎯',
      title: 'Personalized',
      desc: 'Get event recommendations based on your interests and location.',
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Why Choose EventMate?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We make it easy to discover, join, and create meaningful experiences
            with people who share your passions.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-blue-600 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Ready to find your next adventure?
          </h3>
          <p className="text-blue-100 mb-6">
            Join thousands of people discovering amazing events every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/events"
              className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-medium hover:bg-blue-50 transition"
            >
              Browse Events
            </Link>
            <Link
              href="/register"
              className="border border-white text-white px-8 py-3 rounded-2xl font-medium hover:bg-blue-700 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────
// Main Homepage
// ────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <CategoriesSection />
      <FeaturedEventsSection />
      <TopHostsSection />
      <FAQSection />
      <NewsletterSection />
      <WhyUsSection />
    </>
  )
}