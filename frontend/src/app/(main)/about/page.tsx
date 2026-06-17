import { Users, Calendar, MapPin, Heart } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Active Members', value: '2,000+' },
    { icon: Calendar, label: 'Events Hosted', value: '500+' },
    { icon: MapPin, label: 'Cities Covered', value: '50+' },
    { icon: Heart, label: 'Happy Connections', value: '10,000+' },
  ]

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About EventMate
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            We&apos;re on a mission to help people find their tribe — one event at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            EventMate started with a simple observation: countless people skip out on
            concerts, hikes, food festivals, and meetups simply because they don&apos;t
            have anyone to go with. We believed that shouldn&apos;t be a barrier to
            experiencing life&apos;s best moments.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            So we built a platform where anyone can host an event — big or small,
            free or ticketed — and where anyone can discover and join experiences
            that match their interests. The result is a community built on shared
            passions and real-world connections.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Today, EventMate connects thousands of people across Bangladesh through
            concerts, hiking trips, tech meetups, food festivals, and more — turning
            strangers into friends, one event at a time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Community First', desc: 'Every feature we build starts with the question: does this bring people together?' },
              { title: 'Safety & Trust', desc: 'Secure payments, verified hosts, and honest reviews keep our community safe.' },
              { title: 'Inclusivity', desc: 'From free meetups to ticketed concerts — there\'s something for everyone.' },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}