export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By creating an account or using EventMate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
    },
    {
      title: '2. User Accounts',
      content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your password and for all activities under your account. Users must be at least 16 years old to register.',
    },
    {
      title: '3. Hosting Events',
      content: 'Any user can become a host and create events. Hosts are responsible for the accuracy of event details, managing participants, and ensuring events comply with local laws. EventMate is not responsible for the conduct of hosts or attendees at events.',
    },
    {
      title: '4. Payments and Fees',
      content: 'Paid events are processed through SSLCommerz. By joining a paid event, you agree to pay the listed fee. Refund policies are determined by individual event hosts. EventMate is not liable for disputes between users regarding refunds.',
    },
    {
      title: '5. Reviews and Conduct',
      content: 'Reviews must be honest and based on genuine experiences from events you attended. Fake reviews, harassment, hate speech, or fraudulent activity will result in account suspension.',
    },
    {
      title: '6. Prohibited Activities',
      content: 'Users may not: create fraudulent events, impersonate others, upload illegal or offensive content, attempt to bypass payment systems, or use the platform for any unlawful purpose.',
    },
    {
      title: '7. Account Suspension',
      content: 'EventMate reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or are reported for inappropriate conduct.',
    },
    {
      title: '8. Limitation of Liability',
      content: 'EventMate provides a platform for connecting people through events. We do not guarantee the quality, safety, or legality of events listed. Users participate in events at their own risk.',
    },
    {
      title: '9. Changes to Terms',
      content: 'We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the updated terms.',
    },
    {
      title: '10. Contact',
      content: 'For questions about these terms, please reach out through our Contact page.',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}