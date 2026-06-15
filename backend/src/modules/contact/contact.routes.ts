import { Router } from 'express'
import { Request, Response } from 'express'
import { sendContactEmail } from '../../config/email'

const router = Router()

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }

    await sendContactEmail(name, email, subject, message)
    res.status(200).json({ success: true, message: 'Message sent successfully!' })
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' })
  }
})

export default router