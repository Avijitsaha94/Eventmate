export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including your name, email address, profile photo, location, and interests when you create an account. We also collect information about events you create, join, or review, and payment information processed securely through SSLCommerz.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use your information to provide and improve our services, including matching you with relevant events, processing payments, sending booking confirmations and event reminders, and maintaining the security of our platform.',
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell your personal information. We share limited information with event hosts (your name and profile) when you join their events, and with payment processors (SSLCommerz) to complete transactions. We may share information if required by law.',
    },
    {
      title: '4. Data Security',
      content: 'We use industry-standard security measures including password hashing (bcrypt), encrypted connections (HTTPS), and secure JWT-based authentication to protect your data. Payment information is processed directly by SSLCommerz and is never stored on our servers.',
    },
    {
      title: '5. Cookies',
      content: 'We use essential cookies to keep you logged in and maintain your session. We do not use third-party advertising or tracking cookies.',
    },
    {
      title: '6. Your Rights',
      content: 'You can access, update, or delete your profile information at any time through your account settings. You may also request account deletion by contacting our support team.',
    },
    {
      title: '7. Third-Party Services',
      content: 'Our platform integrates with Google (for sign-in), Cloudinary (for image storage), and SSLCommerz (for payments). These services have their own privacy policies governing the data they process.',
    },
    {
      title: '8. Changes to This Policy',
      content: 'We may update this privacy policy from time to time. We will notify users of significant changes by posting a notice on our platform.',
    },
    {
      title: '9. Contact Us',
      content: 'If you have questions about this privacy policy or how we handle your data, please reach out through our Contact page.',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Privacy Policy
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