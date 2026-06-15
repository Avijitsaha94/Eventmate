import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendBookingConfirmationEmail = async (
  toEmail: string,
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  isPaid: boolean,
  amount?: number
) => {
  const mailOptions = {
    from: `EventMate <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Booking Confirmed — ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">EventMate</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Booking Confirmed! 🎉</h2>
          <p style="color: #4B5563;">Hi <strong>${userName}</strong>,</p>
          <p style="color: #4B5563;">You have successfully joined the following event:</p>
          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #111827; margin: 0 0 8px;">${eventTitle}</h3>
            <p style="color: #6B7280; margin: 4px 0;">📅 ${eventDate}</p>
            <p style="color: #6B7280; margin: 4px 0;">📍 ${eventLocation}</p>
            ${isPaid ? `<p style="color: #6B7280; margin: 4px 0;">💳 Paid: ৳${amount}</p>` : '<p style="color: #10B981; margin: 4px 0;">✅ Free Event</p>'}
          </div>
          <p style="color: #4B5563;">Have a great time at the event!</p>
          <a href="${process.env.FRONTEND_URL}/events" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">Browse More Events</a>
        </div>
        <p style="color: #9CA3AF; text-align: center; font-size: 12px; margin-top: 16px;">EventMate — Find Your Next Adventure</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export const sendEventReminderEmail = async (
  toEmail: string,
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  eventId: string
) => {
  const mailOptions = {
    from: `EventMate <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `⏰ Reminder — ${eventTitle} is tomorrow!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563EB; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">EventMate</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827;">Your event is tomorrow! ⏰</h2>
          <p style="color: #4B5563;">Hi <strong>${userName}</strong>, don't forget:</p>
          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #111827; margin: 0 0 8px;">${eventTitle}</h3>
            <p style="color: #6B7280; margin: 4px 0;">📅 ${eventDate}</p>
            <p style="color: #6B7280; margin: 4px 0;">📍 ${eventLocation}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/events/${eventId}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Event Details</a>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export default transporter